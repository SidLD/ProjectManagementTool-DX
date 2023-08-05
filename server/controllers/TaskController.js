import { PrismaClient } from "@prisma/client"
import { getPermission } from "../repository/RoleRepository.js"
import { getMembership } from "../repository/TeamMemberRepository.js"
import { createLog } from "../repository/LogRepository.js"
import { updateProgress } from "../repository/ProjectRepository.js"
const prisma = new PrismaClient()

export const getTask = async (req, res) => {
    try {
        const projectId = req.params.projectId
        const userId = req.user.id
        const params = req.query
        const permissions = await getPermission(userId, projectId);
        if(permissions.includes("VIEW-TASK") || permissions.includes("EDIT-TASK")){
            let data = await prisma.task.findMany({
                where: {
                    ...params,
                    projectId: projectId
                },
                select: {
                    id: true,
                    task: true,
                    description: true,
                    startDate: true,
                    endDate: true,
                    status: true,
                    project:{
                        select: {
                            name: true,
                            id: true
                        }
                    },
                    task_users: {
                        select:{
                            firstName: true,
                            lastName: true,
                            id: true,
                        }
                    }
                    
                }
            })
            res.status(200).send({ok:true, data})
        }else{
            res.status(403).send({ok:true, message: "Access Denied"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false, message: error.message})
    }
}
//This get all the tasks across all the projects
export const getAllTasks = async (req, res) => {
    try {
        const userId = req.user.id
        let query = req.query
        const start = parseInt(query.start)
        const sort = query.sort
        delete query.start
        delete query.sort
        const data = await prisma.task.findMany({
            where: {
                ...query,
                task_users :{
                    some: {
                        id: userId
                    }
                }
            },
            select: {
                id: true,
                task: true,
                startDate: true,
                endDate: true,
                status: true,
                project:{
                    select: {
                        name: true,
                        id: true
                    }
                },
                task_users: {
                    select:{
                        firstName: true,
                        lastName: true,
                        id: true,
                    }
                }
                
            },
            orderBy: sort
        })
        const ifAccessDatas = await Promise.all(
            data.map(async (task) => {
                const tempPermissions = await getPermission(userId ,task.project.id)
                if(tempPermissions.includes("VIEW-TASK")){
                    task.permissions = tempPermissions
                    return task
                }
            })
        )
        res.status(200).send({ok:true, data:ifAccessDatas})
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false, message: error.message})
    }
}
//Only the current User Id can create their own project
export const createTask = async (req, res) => {
    try {
        const projectId = req.params.projectId
        const userId = req.user.id
        const params = req.body
        const permissions = await getPermission(userId, projectId);
        if(permissions.includes("CREATE-TASK")){
            const data = await Promise.all(
                params.map(async (newTask) => {
                    return await prisma.task.create({
                        data: {
                            task: newTask.name,
                            startDate : new Date(newTask.startDate),
                            description: newTask.description,
                            endDate: new Date(newTask.endDate),
                            status: "TO DO",
                            task_users: {
                                connect: newTask?.users?.map((user) => ({id: user.key})) || []
                            },
                            project: {
                                connect: {id: projectId}
                            }
                        }
                    })
                })
            )
            const logs  = await Promise.all(
                data.map( async (createdTask) => {
                    if(createdTask){
                        return await createLog({taskId:createdTask.id, userId:userId})
                    }
            }))
            
            res.status(200).send({ok:true, data, logs})
        }else{
            res.status(400).send({ok:false,message: "Access Denied"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false,message: "Data Required"})
    }
}
export const updateTask = async (req, res) => {
    try {
        const projectId = req.params.projectId
        const taskId = req.params.taskId
        const userId = req.user.id
        const params = req.body
        const permissions = await getPermission(userId, projectId);
        if(permissions.includes("EDIT-TASK")){
            const data = await prisma.task.update({
                where: {
                    projectId: projectId,
                    id: taskId
                },
                data: {
                    ...params
                }
            })
            if(data) {
                await createLog({taskId:data.id, userId:userId, params:{...params}})
            }
            if(params.status){
                updateProgress(projectId)
            }
            res.status(200).send({ok:true, data})
        }else{
            res.status(400).send({ok:false,message: "Access Denied"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false,message: "Data Required"})
    }
}
//Only the Manager User and current User can delete Project
export const deleteTask = async (req, res) => {
    try {
        const projectId = req.params.projectId
        const userId = req.user.id
        const params = req.body
        const permissions = await getPermission(userId, projectId);
        if(permissions.includes("DELETE-TASK")){
            await prisma.comment.deleteMany({
                where: {
                    taskId: params.id
                }
            })
            await prisma.logs.deleteMany({
                where: {
                    taskId: params.id
                }
            })
            const data = await prisma.task.delete({
                where: {
                    projectId: projectId,
                    id: params.id
                },
            })
            res.status(200).send({ok:true, data})
        }else{
            res.status(400).send({ok:false,message: "Access Denied"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false,message: "Data Required"})
    }
}
export const updateTaskUser = async (req, res) => {
    try {
        const {projectId, taskId, method} = req.params
        const params = req.body
        const permissions = await getPermission(req.user.id, projectId);
        if(permissions.includes("EDIT-TASK")){
            if(method === 'assign'){
                const isExist = await prisma.task.findFirst({
                    where: {id: taskId},
                    select: {
                        task_users: {
                            select: {
                                id: true
                            }
                        }
                    }
                })
                const taskUsers = isExist?.task_users.map(user => user.id)
                const newUser = params.task_users.connect[params.task_users.connect.length-1]
                const error = (taskUsers.includes(newUser.id))
                if(error){
                  return res.status(400).send({ok:false, message: "User Already Exist"})
                }
            }
            const data = await prisma.task.update({
                where: {
                    id: taskId
                },
                data: {
                    ...params
                }
            })
            if(data) {
                await createLog({taskId:data.id, userId:req.user.id, params: {task_users:method}})
            }
            res.status(200).send({ok:true, data})
        }else{
            res.status(400).send({ok:false,message: "Access Denied"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false,message: "Data Required"})
    }
}
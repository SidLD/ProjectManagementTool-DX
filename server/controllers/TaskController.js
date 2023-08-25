import { PrismaClient } from "@prisma/client"
import { getPermission } from "../repository/RoleRepository.js"
import { createLog } from "../repository/LogRepository.js"
import { updateProgress } from "../repository/ProjectRepository.js"
const prisma = new PrismaClient()

export const getTask = async (req, res) => {
    try {
        const projectId = req.params.projectId
        const userId = req.user.id
        const params = req.query
        const permissions = await getPermission(userId, projectId);
        if(permissions.includes("VIEW-PROJECT")){
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
                    task_member: {
                        select:{
                            user: {
                                select:{
                                    firstName: true,
                                    lastName: true,
                                    id: true,
                                }
                            }
                        }
                    }
                    
                },           
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
        const sort = query.order
        delete query.start
        delete query.order
        const data = await prisma.task.findMany({
            where: {
                ...query,
                task_member :{
                    some: {
                        userId: userId
                    }
                }
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
                task_member: {
                    select:{
                        user: {
                            select:{
                                firstName: true,
                                lastName: true,
                                id: true,
                            }
                        }
                    }
                }
                
            }, 
            orderBy: sort || {
                task: 'asc'
            },
            skip: start || 0
        })
        const ifAccessDatas = await Promise.all(
            data.map(async (task) => {
                const tempPermissions = await getPermission(userId,task.project.id)
                if(tempPermissions.includes("VIEW-PROJECT")){
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

export const taskCount = async (req, res) => {
    try {
        const userId = req.user.id
        const params = req.query
        let data = await prisma.task.count({
            where: {
                ...params,
                task_member: {
                    some: {
                        userId: userId
                    }
                }
                
            },
        })
        res.status(200).send({ok:true, data})
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
        if(permissions.includes("EDIT-PROJECT")){
            const data = await prisma.task.create({
                data: {
                    task: params.name,
                    startDate : new Date(params.startDate),
                    description: params.description,
                    endDate: new Date(params.endDate),
                    status: "TO_DO",
                    task_member: {  
                        connect: params?.members?.map((member) => ({id: member.id})) || []
                    },
                    project: {
                        connect: {id: projectId}
                    }
                }
            })
            const logs = await createLog({taskId:data.id, userId:userId})
            
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
export const subcribeTask = async (req, res) => {
    try {
        const {projectId, taskId} = req.params
        const params = req.body
        const permissions = await getPermission(req.user.id, projectId);
        if(permissions.includes("EDIT-TASK")){
            const task = await prisma.task.findFirst({
                where: {id: taskId},
                select: {
                    task_member: true
                }
            })
            let membersIds = task.task_member.map((member) => member.id) || []
            if(membersIds.includes(params.memberId)){
                return res.status(400).send({ok:false,message: "User Alread assigned to the Task"})
            }else{
                membersIds.push(params.memberId)
                const data = await prisma.task.update({
                    where: {
                        id: taskId
                    },
                    data: {
                        task_member:{
                            set: membersIds.map((ids) => ({id: ids})) || []
                        }
                    }
                })
                const newMember = await prisma.teamMember.findFirst({
                    where: {id: params.memberId},
                    select: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                })
                if(data) {
                    await createLog({
                        taskId:data.id, 
                        userId:req.user.id, 
                        params: {
                            addUser: newMember.user
                        }
                    })
                }
                res.status(200).send({ok:true, data})
            }
        }else{
            res.status(400).send({ok:false,message: "Access Denied"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false,message: "Data Required"})
    }
}
export const unsubcribeTask = async (req, res) => {
    try {
        const {projectId, taskId} = req.params
        const params = req.body
        const permissions = await getPermission(req.user.id, projectId);
        if(permissions.includes("EDIT-TASK")){
            const task = await prisma.task.findFirst({
                where: {id: taskId},
                select: {
                    task_member: true
                }
            })
            let task_members = task.task_member.filter((member) => member.id != params.memberId)
            const data = await prisma.task.update({
                where: {
                    id: taskId
                },
                data: {
                    task_member:{
                        set: task_members.map((member) => ({id: member.id})) || []
                    }
                }
            })
            const removeMember = await prisma.teamMember.findFirst({
                where: {id: params.memberId},
                select: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            })
            if(data) {
                await createLog({
                    taskId:data.id, 
                    userId:req.user.id, 
                    params: {
                        removeUser: removeMember.user
                    }
                })
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
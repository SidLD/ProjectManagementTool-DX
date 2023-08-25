import { PrismaClient } from "@prisma/client"
import { getPermission } from "../repository/RoleRepository.js"
import { isOnline } from "../lib/ClientBuckets.js"
import { createNotifcation } from "../repository/NotificationRepository.js"
const prisma = new PrismaClient()

export const addTeamMember = async (req, res) => {
    try {
        const params = req.body
        const projectId = req.params.projectId
        const permissions = await getPermission(req.user.id, projectId)
        if(permissions.includes("EDIT-MEMBER")){
            let error = false
            const data = await Promise.all(
                params.map(async (member) => {
                    //Check if the user is Member or Manager, if not add them
                    const isMember = await prisma.teamMember.findMany({
                        where: {
                            AND: [
                                {userId: member.userId},
                                {projectId: projectId}
                            ]
                        },
                    })
                    const isManager = await prisma.project.findMany({
                        where: {
                            AND : [
                                {id: projectId},
                                {managerId: member.userId}
                            ]
                        }
                    })

                    if(isMember.length > 0 || isManager.length > 0){
                        error = true
                        return  
                    }else {
                       const newMember = await prisma.teamMember.create({
                        data: {
                            project: {
                                connect: {
                                    id: projectId
                                }
                            },
                            user: {
                                connect: {
                                    id: member.userId
                                }
                            },
                            role: {
                                connect: {
                                    id: member.roleId
                                }
                            },
                            status:"PENDING"
                        },
                        select:{
                            id: true,
                            project: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true
                                }
                            },
                            role: {
                                select: {
                                    name: true,
                                }
                            }
                        }
                        })
                        await createNotifcation('INVITATION', newMember, req.user.id);
                        return newMember 
                    }
                    
                })
            )
            if(error) {
                res.status(400).send({ok:false,message: "User Already Exist in the Project"})
            }else{
                res.status(200).send({ok:true, data})  
            } 
        }else{
            res.status(400).send({ok:false, message:"Permission Denied"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false,message: "Invalid Data"})
    }   
}

export const getTeamMembers = async (req, res) => {
    try {
        let query = req.query
        const limit = parseInt(query.limit) 
        const start = parseInt(query.start)
        const order = query.order
        delete query.start
        delete query.limit
        delete query.order
        const permissions = await getPermission(req.user.id, query.projectId)
        if(permissions.includes("VIEW-PROJECT")){
            let data = await prisma.teamMember.findMany({
                where: {
                    ...query,
                    status: "ACCEPTED",
                },
                select:{
                    id: true,
                    role: {
                        select: {
                            name: true
                        }
                    },
                    user: {
                        select: {
                            email: true,
                            firstName: true,
                            lastName: true,
                            id: true,
                        }
                    },
                    status: true

                },
                orderBy: order || {
                    user: {
                        firstName: 'asc'
                    }
                },
                skip: start || 0,
                take : limit || 99
            })
            await Promise.all(
                data.map((member) => {
                 member.isActive =  isOnline(member.user.id)
                 return member
                }
            ))
            res.status(200).send({ok:true, data})   
        }else{
            res.status(403).send({ok:false, message:"Permission Denied"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false,message: "Invalid Data"})
    }   
}

export const updateTeamStatus = async (req, res) => {
    try {
        const {teamId} = req.params
        const data = await prisma.teamMember.update({
            where: {id : teamId},
            data: {
                status: "ACCEPTED"
            }
        })
        res.status(200).send({ok:true, data}) 
    } catch (error) {
        console.log(error)
        res.status(400).send({ok: false, message: "Invalid Data"})
    }
}

export const updateTeamMember = async (req, res) => {
    try {
        const roleId = req.body.roleId
        const projectId = req.params.projectId
        const memberId = req.params.memberId
        const permissions = await getPermission(req.user.id, projectId)
        if(permissions.includes("EDIT-MEMBER")){
            const data = await prisma.teamMember.update({
                where: {
                    id: memberId
                },
                data: {
                    role: {
                        connect: {
                            id: roleId
                        }
                    }
                }
            })
            res.status(200).send({ok:true, data})   
        }else{
            res.status(400).send({ok:false, message:"Permission Denied"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false,message: "Invalid Data"})
    } 
}

export const findMember = async (req, res) => {
    try {
        const params = req.body
        const projectId = req.params.projectId
        const permissions = await getPermission(req.user.id)
        if(permissions.includes("VIEW-MEMBER")){
            const data = await prisma.teamMember.findMany({
                where:{
                    AND: [
                        {projectId: projectId},
                        {...params}
                    ]
                }
            })
            console.log(data)
            res.status(200).send({ok:true, data})   
        }else{
            res.status(400).send({ok:false, message:"Permission Denied"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false,message: "Invalid Data"})
    }   
}

export const deleteTeamMember = async (req, res) => {
    try {
        const projectId = req.params.projectId
        const params = req.body
        const permissions = await getPermission(req.user.id, projectId);
        if(permissions.includes("DELETE-MEMBER")){
            const data = await prisma.teamMember.delete({
                where: {
                    id: params.memberId
                },
                include: {
                    user:true
                }
            })
            //Get the user from team member,
            //Find all task associated with that user
            //Delete their relations
            //Somehow deleteMany Relation does not work *
            const relatedTasks = await prisma.task.findMany({
                where: {
                    AND: [
                        {projectId: projectId},
                        {task_users: {
                            some: {
                                id: data.user.id
                            }
                        }}
                    ]
                },
                include: {
                    task_users: true
                }
            })
            const updateTasks = await Promise.all(
                relatedTasks?.map( async (item)=>{
                    const newUsers = item.task_users.filter(user => {
                        if(!(user.id === data.user.id)){   
                            return ({id: user.id})
                        }
                    }) 
                    return await prisma.task.update({
                        where: {
                            id: item.id
                        },
                        data: {
                            task_users: {
                                set: newUsers
                            }
                        },
                        include: {
                            task_users: true
                        }
                    })
                })
            )

            res.status(200).send({ok:true, data, updateTasks})
        }else{
            res.status(400).send({ok:false,message: "Access Denied"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false,message: "Data Required"})
    }  
}
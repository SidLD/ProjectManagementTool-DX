import { PrismaClient } from "@prisma/client"
import { getPermission } from "../repository/RoleRepository.js"
const prisma = new PrismaClient()

export const addTeamMember = async (req, res) => {
    try {
        const params = req.body
        const projectId = req.params.projectId
        const permissions = await getPermission(req.user.id, projectId)
        if(permissions.includes("ADD-MEMBER")){
            const data = await Promise.all(
                params.map((member) => {
                    return prisma.teamMember.create({
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
                            }
                        },
                        select:{
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
                })
            )
            res.status(200).send({ok:true, data})   
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
        const projectId = req.query.projectId
        const permissions = await getPermission(req.user.id, projectId)
        if(permissions.includes("VIEW-MEMBER")){
            const data = await prisma.teamMember.findMany({
                where: {
                    projectId: projectId
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
                            firstName: true,
                            lastName: true,
                            id: true,
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
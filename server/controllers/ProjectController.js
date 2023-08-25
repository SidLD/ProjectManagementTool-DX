import { PrismaClient } from "@prisma/client"
import { createRole, getProjectUpdatePermission, getPermission } from "../repository/RoleRepository.js"
const prisma = new PrismaClient()

export const getProjects = async (req, res) => {
    try {
        //For Pagination
        const params = req.query
        const order = params?.order
        const limit = parseInt(params?.limit)
        const start = parseInt(params?.start)
        delete params.order
        delete params.limit
        delete params.start
        let data = null
        if(params.id){
            const permissions = await getPermission(req.user.id, params.id)
            if(permissions.includes("VIEW-PROJECT") || permissions.includes("EDIT-PROJECT")){
                data = await prisma.project.findMany({
                    where: params,
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        progress: true,
                        startDate: true,
                        endDate: true,
                        manager: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    },
                    orderBy: order || {
                        name: 'asc'
                    },
                    skip: start || 0,
                    take : limit || 99
                })
            }else{
                return res.status(403).send({ok:false, message:"Access Denied"})
            }
        }else{
            data = await prisma.project.findMany({
                where: {
                    OR: [
                        {AND: [
                            {teamMembers: { 
                                some: { 
                                    userId: req.user.id,
                                    status: "ACCEPTED" 
                                }
                            }},
                            {...params}
                        ]},
                        {AND: [
                            {managerId: req.user.id},
                            {...params}
                        ]}
                    ]
                    
                },
                select:  {
                    id: true,
                    name: true,
                    description: true,
                    progress: true,
                    startDate: true,
                    endDate: true,
                },
                orderBy: order || {
                    name: 'asc'
                },
                skip: start || 0,
                take : limit || 99
            })
        }
        res.status(200).send({ok:true, data})
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false, message: error.message})
    }
}
//Only the current User Id can create their own project
export const createProject = async (req, res) => {
    try {
        const userId = req.user.id
        const params = req.body
        const data = await prisma.project.create({
            data: {
                name: params.name,
                description: params.description,
                startDate: new Date(params.startDate),
                endDate: new Date(params.endDate),
                manager: {
                    connect:{id:userId}
                },
            },
            select: {
                id: true
            }
        })
        res.status(200).send({ok:true, data})
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false,message: "Data Required"})
    }
}
//Not Done
export const updateProject = async (req, res) => {
    try {
        const projectId = req.params.projectId
        const params = req.body
        const permissions = await getPermission(req.user.id,projectId)
        if(permissions.includes('EDIT-PROJECT')){
            const data = await prisma.project.update({
                where: {id: projectId},
                data: {
                    name: params.name,
                    description: params.description,
                    startDate: new Date(params.startDate),
                    endDate: new Date(params.endDate)
                }
            })
            res.status(200).send({ok: true, data})
        }else{
            res.status(403).send({ok:false, message: "Access Denied"})
        }
    } catch (error) {
        console.log(error.message)
        res.status(400).send({ok:false, message: error.message})
    }
}
//Only the Manager User and current User can delete Project
export const deleteProject = async (req, res) => {
    try {
        const projectId = req.body.projectId
        const permissions = await getPermission(req.user.id, projectId)
        if(permissions.includes("DELETE-PROJECT")){
            const deleteRoles = await prisma.role.deleteMany({
                where: {
                    projectId: projectId
                }
            })
            const deleteTeamMember = await prisma.teamMember.deleteMany({
                where:{
                    projectId: projectId
                }
            })
            const deleteTasks = await prisma.task.deleteMany({
                where: {
                    projectId: projectId
                }
            })
            const deleteProject = await prisma.project.delete({
                where:{
                   id: projectId
                }
            })
            const data = {
                deleteRoles,
                deleteTeamMember,
                deleteTasks,
                deleteProject
            }
            res.status(200).send({ok:true, data})
        }else{
            res.status(403).send({ok:false, message: "Access Denied"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false,message: "Project Not Found"})
    }
}
import { PrismaClient } from "@prisma/client"
import { createRole, getProjectUpdatePermission, getPermission } from "../repository/RoleRepository.js"
const prisma = new PrismaClient()

export const getProjects = async (req, res) => {
    try {
        const params = req.query
        let data = null
        if(params.id){
            const permissions = await getPermission(req.user.id, params.id)
            data = await prisma.project.findMany({
                where: params,
                select: permissions.includes("VIEW-PROJECT") && {
                    id: true,
                    name: true,
                    description: true,
                    progress: true,
                    startDate: true,
                    endDate: true,
                }
            })
        }else{
            data = await prisma.project.findMany({
                where: {
                    managerId: req.user.id
                },
                select:  {
                    id: true,
                    name: true,
                    description: true,
                    progress: true,
                    startDate: true,
                    endDate: true,
                }
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
        const project = await prisma.project.create({
            data: {
                name: params.name,
                description: params.descripion,
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
        const roles = await Promise.all(
            params?.roles?.map(async(role) => await createRole(role, project.id))
        )
        res.status(200).send({ok:true, data: {project, roles}})
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false,message: "Data Required"})
    }
}
//Not Done
export const updateProject = async (req, res) => {
    try {
        const userId = req.user.id
        const projectId = req.params.projectId
        const data = await getProjectUpdatePermission(projectId, userId)
        res.status(200).send({ok: true, data})
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
            res.status(400).send({ok:false, message: "Access Denied"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false,message: "Project Not Found"})
    }
}
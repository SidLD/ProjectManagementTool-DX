import { PrismaClient } from "@prisma/client"
import { getPermission } from "../repository/RoleRepository.js"
const prisma = new PrismaClient()

export const getRoles = async (req, res) => {
    try {
        const projectId = req.query.projectId
        const params = req.query
        const order = params?.order
        const limit = parseInt(params?.limit)
        const start = parseInt(params?.start)
        delete params.order
        delete params.limit
        delete params.start
        const permissions = await getPermission(req.user.id, projectId)
        if(permissions.includes("VIEW-ROLE") || permissions.includes("EDIT-ROLE")){
            const data = await prisma.role.findMany({
                where: {
                    projectId: projectId
                },
                select: {
                    id: true,
                    name: true,
                    role_permissions:{
                        select: {
                            id: true,
                            name: true,
                            label: true
                        }
                    }
                },
                orderBy: order || {
                    name: 'asc'
                },
                skip: start || 0,
                take : limit || 99
            })
            res.status(200).send({ok:true, data})
        }else{
            res.status(403).send({ok:false, message: "Access Denied"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false, message: error.message})
    }
}
export const getUserRole = async (req, res) => {
    try {
        const projectId = req.query.projectId
        const userId = req.user.id
        const ifManager = await prisma.project.findFirst({
            where: {
                id: projectId,
                managerId: userId
            }
        })
        if(ifManager){
            const permission = await getPermission(userId, projectId)
            res.status(200).send({ok:true, data: {
                name: "MANAGER",
                permissions: permission
            }})
        }else{
            const data = await prisma.role.findMany({
                where: {
                    projectId: projectId,
                    role_member: {
                        some: {
                            userId: userId
                        }
                    },
                },
                select: {
                    id: true,
                    name: true,
                    role_permissions:{
                        select: {
                            id: true,
                            name: true,
                            label: true
                        }
                    }
                },
            })
            res.status(200).send({ok:true, data: data[0]})
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false, message: error.message})
    }
}
export const createRole = async (req, res) => {
    try {
        const projectId = req.params.projectId
        const params = req.body
        const permissions = await getPermission(req.user.id, projectId)
        if(permissions.includes('EDIT-ROLE')){
            const data =  await prisma.role.create({
                data: {
                    name: params.name.toUpperCase(),
                    project: {
                        connect: {
                            id: projectId
                        }
                    },
                    role_permissions:{
                        connect: params?.role_permissions?.map(permission => ({id: permission}))
                    },
                }
            })
            res.status(200).send({ok:true, data})
        }else{
            res.status(403).send({ok:false, message: "Access Denied"})
        }

    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false,message: "Data Required"})
    }
}
export const updateRole = async (req, res) => {
    try {
        const projectId = req.params.projectId
        const roleId = req.params.roleId
        const params = req.body
        const permissions = await getPermission(req.user.id)
        console.log(params)
        if(permissions.includes("EDIT-ROLE")){
            const data = await prisma.role.update({
                where: {
                    id:roleId,
                    projectId: projectId
                },
                data: {
                    name: params?.name,
                    role_permissions: {
                        connect: params.permissions.map(p => ({id:p})) || []
                    }
                }
            })
            res.status(200).send({ok: true, data})
        }else{
            res.status(403).send({ok:false, message: "Access Denied"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false, message: error.message})
    }
}
export const deleteRole = async (req, res) => {
    try {
        const projectId = req.params.projectId
        const params = req.body
        const permissions = await getPermission(req.user.id)
        if(permissions.includes("EDIT-ROLE")){
            // const removeUser = await prisma.teamMember.updateMany({
            //     where: {
            //         AND: [
            //             {roleId: params.roleId},
            //             {projectId: projectId}
            //         ]
            //     },
            //     data: {
            //         roleId: null
            //     }
            // }) 
            const data = await prisma.role.delete({
                where: {
                    id:params.roleId,
                    project:{
                        id: projectId
                    }
                },
            })
            res.status(200).send({ok:true, data})
        }else{
            res.status(403).send({ok:false, message: "Access Denied"})
        }
    } catch (error) {
        console.log(error.message)
        res.status(400).send({ok:false, message: error.message})
    }
}

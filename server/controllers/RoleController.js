import { PrismaClient } from "@prisma/client"
import { getPermission } from "../repository/RoleRepository.js"
const prisma = new PrismaClient()

export const getRoles = async (req, res) => {
    try {
        const projectId = req.query.projectId
        const permissions = await getPermission(req.user.id, projectId)
        if(permissions.includes("VIEW-ROLE")){
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
                            name: true
                        }
                    }
                }
            })
            res.status(200).send({ok:true, data})
        }else{
            res.status(200).send({ok:false, message: "Access Denied"})
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
        const permissions = await getPermission(req.user.id)
        if(permissions.includes('VIEW-ROLE')){
            const data = await Promise.all(
                params.map(async (newRole) => {
                    console.log(newRole)
                    return await prisma.role.create({
                        data: {
                            name: newRole.name.toUpperCase(),
                            project: {
                                connect: {
                                    id: projectId
                                }
                            },
                            role_permissions:{
                                connect: newRole?.permissions?.map(permission => ({id: permission}))
                            },
                        }
                    })
                })
            )
            res.status(200).send({ok:true, projectId, data})
        }else{
            res.status(400).send({ok:false, message: "Access Denied"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false,message: "Data Required"})
    }
}
//Not Done
export const updateRole = async (req, res) => {
    try {
        const projectId = req.params.projectId
        const roleId = req.params.roleId
        const params = req.body
        const permissions = await getPermission(req.user.id)
        if(permissions.includes("EDIT-ROLE")){
            const data = await prisma.role.update({
                where: {
                    id:roleId,
                    project:{
                        id: projectId
                    }
                },
                data: params
            })
            res.status(200).send({ok: true, data})
        }else{
            res.status(400).send({ok:false, message: "Access Denied"})
        }
    } catch (error) {
        console.log(error.message)
        res.status(400).send({ok:false, message: error.message})
    }
}
export const deleteRole = async (req, res) => {
    try {
        const projectId = req.params.projectId
        const params = req.body
        const permissions = await getPermission(req.user.id)
        if(permissions.includes("DELETE-ROLE")){
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
            res.status(400).send({ok:false, message: "Access Denied"})
        }
    } catch (error) {
        console.log(error.message)
        res.status(400).send({ok:false, message: error.message})
    }
}
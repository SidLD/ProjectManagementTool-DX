import { PrismaClient } from "@prisma/client"
import { defaultRoles } from "../lib/defaultRoles.js"
const prisma = new PrismaClient()
export const createRole = async (role, projectId) => {
    return new Promise((resolve, reject) => {
        prisma.role.create({
            data : {
                name: role.name.toUpperCase(),
                project: {
                    connect: {
                        id: projectId
                    }
                },
                role_permissions:{
                    connect: role?.role_permissions?.map(permission => ({id: permission.id}))
                }
            },
        })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
}
export const generateDefaultRole = async (projectId) => {
   try {
    const result = await Promise.all( 
        defaultRoles.map(async (role) => {
        return await createRole(role, projectId)
    }))
    return result
   } catch (error) {
    console.log(error)
    return null
   }
}
export const getProjectUpdatePermission = async (projectId, userId) => {
    const ifManager = await prisma.project.findFirst({
        where: {
            AND: [
                {id: projectId},
                {managerId: userId}
            ]
        }
    })
    if(ifManager){
        return true
    }else{
        const permissions = await prisma.teamMember.findFirst({
            where: {
                id: projectId,
                userId : userId
            },
            select: {
                role: {
                    select: {
                        name:true,
                        permission: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })
        console.log(permissions)
        return false
    }
}
export const getPermission = async (userId, projectId) => {
    const ifManager = await prisma.project.findFirst({
        where: {
            AND: [
                {id: projectId},
                {managerId: userId}
            ]
        }
    })
    if(ifManager){
        return [
            'VIEW-PROJECT',
            'EDIT-PROJECT',
            'DELETE-PROJECT',
            'EDIT-TASK',
            'DELETE-TASK',
            'CREATE-TASK',
            'VIEW-TASK',
            'VIEW-MEMBER',
            'ADD-MEMBER',
            'DELETE-MEMBER',
            'ADD-ROLE',
            'DELETE-ROLE',
            'EDIT-ROLE',
            'VIEW-ROLE'
        ]
    }else{
        const permissions = await prisma.teamMember.findFirst({
            where: {
                projectId: projectId,
                userId : userId
            },
            select: {
                role: {
                    select: {
                        name:true,
                        role_permissions: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })
        const result = permissions.role.role_permissions.map(temp => temp.name)
        return result
    }
}
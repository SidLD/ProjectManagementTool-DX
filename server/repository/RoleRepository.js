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
        return false
    }
}
export const getPermission = async (userId, projectId) => {
    try {
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
                'EDIT-PROJECT',
                'EDIT-TASK',
                'VIEW-TASK',
                'EDIT-MEMBER',
                'VIEW-MEMBER',
                'EDIT-ROLE',
                'VIEW-ROLE',
            ]
        }else{
            const member = await prisma.teamMember.findFirst({
                where: {
                    projectId: projectId,
                    userId : userId,
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
            const result = member?.role?.role_permissions.map(temp => temp.name) || []
            /**
             * VIEW PROJECT should only be available to the member, but some member might lose their role
                when manager remove delete role without reasigning them first
                A member can be part of the project but does not have any role
                To solve the problem, I must check first wether the member is indeed a member
                and if it is true, then add VIEW PROJECT permission
             */
            if(member){
                result.push("VIEW-PROJECT")
            }
            return result
        }
    } catch (error) {
        return []
    }
}
import { PrismaClient } from "@prisma/client"
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
                'EDIT-MEMBER',
                'EDIT-ROLE',
                'VIEW-PROJECT',
                'DELETE-PROJECT',
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

            return result
        }
    } catch (error) {
        return []
    }
}
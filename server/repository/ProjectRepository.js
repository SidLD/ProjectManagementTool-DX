import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export const getProjectRoles = async (projectId) => {
    const project = await prisma.project.findFirst({
        where: {
            id: projectId
        },
        select: {
            managerId: true,
            roles: {
                select: {
                    id: true,
                    name: true,
                    role_permissions: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }
        }
    })
    return project.roles
}
export const updateProgress = async (projectId) => {
    const completedTask = await prisma.task.count({
        where: {
            AND: [
                {projectId: projectId},
                {status: "COMPLETED"}
            ]
        }
    })
    const allTask = await prisma.task.count({
        where: {
            projectId: projectId
        }
    })
    await prisma.project.update({
        where: {
            id: projectId
        },
        data: {
            progress: (completedTask/allTask * 100 )
        }
    })
}
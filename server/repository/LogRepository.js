import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export const createLog = async ({taskId, userId, params}) => {
    let detail = ""
    if(params){
        const ifUpdateStatus = params.status ?  true : false
        const ifTask = params.task ? true: false
        const ifStartDate = params.startDate ? true : false
        const ifEndDate = params.endDate ? true : false
        const ifDescription = params.description ? true: false

        detail += ifUpdateStatus ? `Update Status` : ""
        detail += ifTask ? `Update Task` : ""
        detail += ifStartDate ? `Update Start Date` : ""
        detail += ifEndDate ? `Update End Date` : ""
        detail += ifDescription ? `Update Description` : ""
    }else{
        detail = `Create Task`
    }
    return await prisma.logs.create({
        data: {
            detail: detail,
            task: {
                connect: {
                    id: taskId
                }
            },
            user: {
                connect: {
                    id: userId
                }
            }
        }
    })
}
export const getLog = async (taskId) => {
    return await prisma.logs.findMany({
        where: {
            taskId: taskId
        },
        select: {
            detail: true,
            createdAt: true,
            user: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        },
        orderBy: {
            createdAt:'asc'
        }
    })
}
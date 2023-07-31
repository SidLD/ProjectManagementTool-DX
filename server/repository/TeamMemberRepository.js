import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()


//This is to make sure that the user is indeed part of the project
export const getMembership = async (userId, projectId) => {
    return new Promise((resolve, reject) => {
        prisma.teamMember.findFirst({
            where: {
                AND: [
                    {projectId: projectId},
                    {userId: userId}
                ]
            }
        })
        .then((data) => resolve(data))
        .catch((err) => reject(err))
    })
}
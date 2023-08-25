import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export const createNotifcation = async (type, content, userId) => {
    let result 
    switch (type) {
        case "INVITATION":
            result = await prisma.notification.create({
                data: {
                    type: "INVITATION",
                    teamId: content.id,
                    userId: userId
                }
            })
            break;
    
        case "MENTION":
            result = await prisma.notification.create({
                data: {
                    type: "MENTION",
                    mentionId: content.id,      
                    userId: userId
                }
            })
            break;
        case "REPLY":
            result = await prisma.notification.create({
                data: {
                    type: "REPLY",
                    commentId: content.id,
                    userId: userId
                }
            })
            break;
        default:
            break;
    }
    return result
}

export const updateReadNotification = async (notificationId) => {
    return await prisma.notification.update({
        where: {id: notificationId},
        data: {
            isRead: true
        }
    })
}
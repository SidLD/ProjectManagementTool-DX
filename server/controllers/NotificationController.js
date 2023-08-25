import { PrismaClient } from "@prisma/client"
import { isOnline } from "../lib/ClientBuckets.js"
const prisma = new PrismaClient()

export const getAllNotification = async (req, res) => {
    try {
        const userId = req.user.id
        let data = await prisma.notification.findMany({
            where: {
                OR: [
                    {mention: {
                        userId: userId
                    }},
                    {team:{
                        userId: userId
                    }},
                    {comment: {
                       parentComment: {
                        userId: userId
                       }
                    }}
                ]
            },
            include: {
                user: true,
                comment: {
                    include: {
                        task: true
                    }
                },
                mention: {
                    include: {
                        comment: {
                            include: {
                                task: true
                            }
                        }
                    }
                },
                team: {
                    include: {
                        user: true
                    }
                },
            
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        await Promise.all(
            data?.map((item)=>{
                if(item.team){
                    item.team.user.password = undefined
                }
                item.user.email = undefined
                item.user.password = undefined
                item.user.createdAt = undefined
                item.user.updatedAt = undefined
                item.user.isActive = isOnline(item?.user.id)
            })
        )
        res.status(200).send({ok:true, data})
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false, message: error.message})
    }
}


export const updateNotifications = async (req, res) => {
    try {
        const notificationId = req.params.notificationId
        const data =  await prisma.notification.update({
            where: {id: notificationId},
            data: {
                isRead: true
            }
        })
        res.status(200).send({ok:false, data})
    } catch (error) {
        res.status(400).send({ok:false, message: error.message})
    }
}

export const updateAllMention = async (req, res) => {
    try {
        const userId = req.user.id

        const data = await prisma.notification.updateMany({
            where: {
                OR: [
                    {mention: {
                        userId: userId
                    }},
                    {comment: {
                       parentComment: {
                        userId: userId
                       }
                    }}
                ]
            },
            data: {
                isRead: true  
            }
        })
        console.log(data)
        res.status(200).send({ok: true, data, message: "Success"})
    } catch (error) {
        res.status(400).send({ok:false, message: error.message})
    }
}
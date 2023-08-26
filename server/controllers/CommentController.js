import { PrismaClient } from "@prisma/client"
import { isOnline } from "../lib/ClientBuckets.js"
import { createNotifcation } from "../repository/NotificationRepository.js"
const prisma = new PrismaClient()
export const createComment = async (req, res) => {
    try {
        
        // detail: message,
        // ids: mentioned user id
        const taskId = req.params.taskId
        const params = req.body
        const userId = req.user.id
        let result = await prisma.comment.create({
            data:{
                detail: params.detail,
                user: {
                    connect: {
                        id: userId
                    }
                },
                task: {
                    connect: {
                        id: taskId
                    }
                },

            },
            select: {
                taskId: true,
                createdAt: true,
                detail: true,
                id: true,
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        id: true,
                    }
                }
            }
        })
        result.user.isActive = true
        if(params?.ids.length > 0){
           const mentions =  await Promise.all(
                //Need to manually create each mention so that we can get the id and use it to create notification
                params.ids.map(async (mentionedUserId) => {
                    try {
                       const createdMention =  await prisma.mention.create({
                            data: {
                                comment:{
                                    connect: {id: result.id}
                                },
                                user: {
                                    connect: {id: mentionedUserId}
                                }
                            }
                        })
                        await createNotifcation('MENTION', createdMention, userId);
                        return createdMention
                    } catch (error) {
                        console.log(error)
                    }
                })
            )
            
            result.mentions = mentions
        }

        res.status(200).send({ok:true, data:result})
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false, message: error.message})
    }
}
export const replyComment = async (req, res) => {
    try {
        const params = req.body
        const taskId = req.params.taskId
        const parentId = req.body.parentId
        const userId = req.user.id
        //Create Comment
        let data = await prisma.comment.create({
            data:{
                detail: params.detail,
                user: {
                    connect: {
                        id: userId
                    }
                },
                parentComment: {
                    connect: {
                     id: parentId
                    }
                },
                task: {
                    connect: {
                        id: taskId
                    }
                }
            },
            include: {
                task:  true
            }
        })
        //Create Mention
        if(params?.ids.length > 0){
            const mentions =  await Promise.all(
                 //Need to manually create each mention so that we can get the id and use it to create notification
                 params.ids.map(async (mentionedUserId) => {
                     try {
                        const createdMention =  await prisma.mention.create({
                             data: {
                                 comment:{
                                     connect: {id: result.id}
                                 },
                                 user: {
                                     connect: {id: mentionedUserId}
                                 }
                             }
                         })
                         await createNotifcation('MENTION', createdMention, userId);
                         return createdMention
                     } catch (error) {
                         console.log(error)
                     }
                 })
             )
            data.mentions = mentions
        }
        //Create Reply Notification
        await createNotifcation('REPLY', data, userId);
        res.status(200).send({ok:true, data})
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false, message: error.message})
    }
}
export const getComment = async (req, res) => {
    try {
        const taskId = req.params.taskId
        const data = await prisma.comment.findMany({
            where: {
                taskId: taskId,
                parentId: null
            },
            select: {
                id: true,
                detail: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        })
        await Promise.all(
            data?.map((item)=>{
                item.user.isActive = isOnline(item?.user.id)
            })
        )
        res.status(200).send({ok:true, data})
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false, message: error.message})
    }
}
export const getReplyComment = async (req, res) => {
    try {
        const commentId = req.params.commentId
        const data = await prisma.comment.findMany({
            where: {
                parentId: commentId
            },
            select: {
                id: true,
                detail: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                },
                taskId: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        })
        await Promise.all(
            data?.map((item)=>{
                item.user.isActive = isOnline(item?.user.id)
            })
        )
        res.status(200).send({ok:true, data})
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false, message: error.message})
    }
}
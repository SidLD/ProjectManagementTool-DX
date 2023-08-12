import { PrismaClient } from "@prisma/client"
import { isOnline } from "../lib/ClientBuckets.js"
const prisma = new PrismaClient()
export const createComment = async (req, res) => {
    try {
        
        // detail: message,
        // mentions: savedMentions
        const taskId = req.params.taskId
        const params = req.body
        const userId = req.user.id
        const data = await prisma.comment.create({
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
                }
            }
        })
        console.log(data)
        if(params.mentions){
            await Promise.all(
                params.mentions.map(async (userEmail) => {
                    const users = await prisma.user.findMany({
                        where: {email: userEmail}
                    })
                    const user = users[0]
                    await prisma.mention.create({
                        data: {
                            comment:{
                                connect: {id: data.id}
                            },
                            users: {
                                connect: {id: user.id}
                            }
                        }
                    })
                })
            )
        }

        res.status(200).send({ok:true, data})
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false, message: error.message})
    }
}
export const replyComment = async (req, res) => {
    try {
        const detail = req.body.detail
        const taskId = req.params.taskId
        const parentId = req.body.parentId
        const userId = req.user.id
        const data = await prisma.comment.create({
            data:{
                detail: detail,
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
            }
        })

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
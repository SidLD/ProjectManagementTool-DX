import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export const createComment = async (req, res) => {
    try {
        const taskId = req.params.taskId
        const detail = req.body.detail
        const userId = req.user.id
        const data = await prisma.comment.create({
            data:{
                detail: detail,
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
        
        console.log("reply", req.body)
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
        console.log(req.params.taskId)
        const data = await prisma.comment.findMany({
            where: {taskId: taskId},
            select: {
                id: true,
                detail: true,
                childrenComment: {
                    select: {
                        id: true,
                        detail: true,
                        user: true,
                        createdAt: true
                    }
                },
                createdAt: true,
                user: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        res.status(200).send({ok:true, data})
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false, message: error.message})
    }
}
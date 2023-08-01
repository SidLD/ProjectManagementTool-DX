import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export const creatComment = async (req, res) => {
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
export const getComment = async (req, res) => {
    try {
        const taskId = req.query.taskId
        const data = await prisma.comment.findMany({
            where: {taskId: taskId},
            select: {
                detail: true,
                childrenComment: {
                    select: {
                        detail: true
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
                createdAt: 'desc'
            }
        })

        res.status(200).send({ok:true, data})
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false, message: error.message})
    }
}
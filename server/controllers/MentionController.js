import { PrismaClient } from "@prisma/client"
import { isOnline } from "../lib/ClientBuckets.js"
const prisma = new PrismaClient()

export const getMention = async (req, res) => {
    try {
        const userId = req.user.id
        let data = await prisma.mention.findMany({
            where: {
                users: {
                    some: {id: userId}
                }
            },
            select: {
                id: true,
                isRead: true,
                comment: {
                    select: {
                        id: true,
                        detail: true,
                        createdAt: true,
                        user: {
                            select: {
                                firstName: true,
                                lastName:true,
                                id: true
                            }
                        },
                        task: {
                            select: {
                                id: true,
                                projectId: true
                            }
                        }
                    },
                }
            }
        })
        await Promise.all(
            data?.map((item)=>{
                item.comment.user.isActive = isOnline(item?.comment?.user.id)
            })
        )
        res.status(200).send({ok:true, data})
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false, message: error.message})
    }
}

export const updateMention = async (req, res) => {
    try {
        const userId = req.user.id
    } catch (error) {
        res.status(400).send({ok:false, message: error.message})
    }
}

export const updateAllMention = async (req, res) => {
    try {
        const userId = req.user.id

        const data = await prisma.mention.updateMany({
            where: {users: {
                some: {id: userId}
            }},
            data: {
                isRead: true
            }
        })

        res.status(200).send({ok: true, data, message: "Success"})
    } catch (error) {
        res.status(400).send({ok:false, message: error.message})
    }
}
import { PrismaClient } from "@prisma/client"
import { getLog } from "../repository/LogRepository.js"
const prisma = new PrismaClient()

export const getLogs = async (req, res) => {
    try {
        const taskId = req.query.taskId
        const data = await getLog(taskId)
        res.status(200).send({ok:true, data})
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false, message: error.message})
    }
}
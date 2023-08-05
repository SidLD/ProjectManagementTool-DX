import { PrismaClient } from "@prisma/client"
import { getPermission } from "../repository/RoleRepository.js"
import { defaultPermission } from "../repository/PermissionRepository.js"
const prisma = new PrismaClient()

export const getAllPermissions = async (req, res) => {
    try {
        const permissions = await prisma.permission.findMany(
            {
                orderBy : {
                    name: 'desc'
                }
            }
        )
        res.status(200).send({ok:true, data: permissions})
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false, message: error.message})
    }
}

export const getUserPermission = async (req, res) => {
    try {
        const projectId = req.query.projectId
        const permissions = await getPermission(req.user.id, projectId)
        res.status(200).send({ok:true, data: permissions})
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false, message: error.message})
    }
}
export const generatePermissions = async (req, res) =>{
    try {
        const ifAdmin = await prisma.user.findFirst({
            where: {
                AND: [
                    {id: req.user.id },
                    {email: "sid@admin.com" }
                ]
            }
        })
        if(ifAdmin){
            const initPermissions = await prisma.permission.createMany({
                data: defaultPermission.map((permission) => ({name: permission})) || []
            }) 
            res.status(200).send({ok:true, data: initPermissions})
        }else{
            res.status(400).send({ok:false, message: "Access Denied"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false, message: error.message})
    }
}
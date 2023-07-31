import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
export const defaultPermission = [
    'VIEW-PROJECT',
    'EDIT-PROJECT',
    'DELETE-PROJECT',
    'EDIT-TASK',
    'DELETE-TASK',
    'CREATE-TASK',
    'VIEW-TASK',
    'VIEW-MEMBER',
    'ADD-MEMBER',
    'DELETE-MEMBER',
    'ADD-ROLE',
    'DELETE-ROLE',
    'EDIT-ROLE',
    'VIEW-ROLE'
]

export const generateDefaultPermissions = async () => {
    defaultPermission.map(async (permission) => {
        await prisma.permission.create({
            data: {
                name: permission
            }
        })
    })
}
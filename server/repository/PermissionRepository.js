import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
export const defaultPermission = [
    {
        name: 'EDIT-PROJECT',
        label: "Allows User to MANAGE PROJECT AND TASKS."
    },{
        name: 'EDIT-TASK',
        label: "Allows User to edit TASK he is ASSIGNED to."
    },{
        name: 'EDIT-MEMBER',
        label: "Allow user to ADD and REMOVE MEMBERS."
    },{
        name: 'EDIT-ROLE',
        label: "Allow user to ADD and EDIT PERMISSIONS in ROLES in the Project."
    },{
        name:'VIEW-PROJECT',
        label: "Allows user to VIEW ALL in the Project."
    }
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
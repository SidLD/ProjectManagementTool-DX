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
        name: 'VIEW-TASK',
        label: "Allows to VIEW All Task in the PROJECT."
    },{
        name: 'EDIT-MEMBER',
        label: "Allow user to ADD and REMOVE MEMBERS."
    },{
        name: 'VIEW-MEMBER',
        label: "Allows user to VIEW ALL MEMBER in the Project."
    },{
        name:'EDIT-ROLE',
        label: "Allow user to ADD and Remove Roles in the Project."
    },{
        name:'VIEW-ROLE',
        label: "Allows user to VIEW ALL ROLE & PERMISSIONS in the Project."
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
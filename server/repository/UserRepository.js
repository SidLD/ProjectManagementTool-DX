import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()


//This is to make sure that the user is indeed part of the project
export const getUserConnectedUsers = async (userId) => {
    try {
        const projects = await prisma.project.findMany({
            where: {
                OR: [
                    {AND: [
                        {teamMembers: { 
                            some: { 
                                userId: userId,
                                status: "ACCEPTED" 
                            }
                        }},
                    ]},
                    {AND: [
                        {managerId: userId}
                    ]}
                ]
                
            },
            select:  {
                managerId: true,
                teamMembers:{
                    select: {
                        userId: true
                    }
                }
            },
        })
        let users = []
        projects.map(project => {
            if(!users.includes(project.managerId)){
                users.push(project.managerId)
            }
            project.teamMembers.map(team => {
                if(!users.includes(team.userId)){
                    users.push(team.userId)
                }
            })
        })
        return users
    } catch (error) {
        console.log(error)   
        return []
    }
}

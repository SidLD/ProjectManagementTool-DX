let users = []
let taskRoom = []

export const addUser = (userId) => {
    users.push(userId)
}
export const removeUser = (userId) => {
   delete users[userId]
}
export const isOnline = (userId) => {
    return users.includes(userId)
}
export const getClients = () => users;

export const addTaskRoom = (taskId) => {
    
}
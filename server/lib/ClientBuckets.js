let users = []

export const addUser = (userId) => {
    users.push(userId)
}
export const removeUser = (userId) => {
   users.splice(userId)
}
export const isOnline = (userId) => {
    return users.includes(userId)
}
export const getClients = () => users;

export const addTaskRoom = (taskId) => {
    
}
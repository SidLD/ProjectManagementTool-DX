let users = []

export const addUser = (userId) => {
    users.push(userId)
}
export const removeUser = (userId) => {
   users = users.filter((user) => user!==userId)
}
export const isOnline = (userId) => {
    console.log("users", users)
    return users.includes(userId);
}
export const getClients = () => users;
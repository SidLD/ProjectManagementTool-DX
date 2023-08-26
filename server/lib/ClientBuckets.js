let users = []

export const addUser = (userId) => {
    users.push(userId)
}

export const removeUser = (userId) => {
   users = users.filter(ids => ids != userId)
}

export const isOnline = (userId) => {
    return users.includes(userId)
}

export const getClients = () => users;

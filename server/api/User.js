import express from 'express'
const userAPI = express()
import {
    deleteUser,
    getUsers,
    login,
    register,
    updateUser
} from '../controllers/UserController.js'
import {verifyToken} from '../lib/verifyToken.js';

userAPI.post('/login', login)
userAPI.post("/register", register);
userAPI.get("/user", verifyToken, getUsers)
userAPI.put("/user",verifyToken, updateUser)
userAPI.delete("/user",verifyToken, deleteUser)

export default userAPI

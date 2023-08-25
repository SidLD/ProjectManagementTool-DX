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
const apiVersion = process.env.API_VERSION;

userAPI.post(`/${apiVersion}/login`, login)
userAPI.post(`/${apiVersion}/register`, register);
userAPI.get(`/${apiVersion}/users`, verifyToken, getUsers)
userAPI.put(`/${apiVersion}/users`,verifyToken, updateUser)
userAPI.delete(`/${apiVersion}/users`,verifyToken, deleteUser)

export default userAPI

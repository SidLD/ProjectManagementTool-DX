import express from 'express'
import { createRole, deleteRole, getRoles, getUserRole, updateRole } from '../controllers/RoleController.js';
import { verifyToken } from '../lib/verifyToken.js';

const roleAPI = express()
const apiVersion = process.env.API_VERSION;

roleAPI.get(`/${apiVersion}/roles`,verifyToken, getRoles);
roleAPI.get(`/${apiVersion}/users/roles`, verifyToken, getUserRole)
roleAPI.post(`/${apiVersion}/projects/:projectId/roles`,verifyToken, createRole)
roleAPI.put(`/${apiVersion}/projects/:projectId/roles/:roleId`,verifyToken, updateRole)
roleAPI.delete(`/${apiVersion}/projects/:projectId/roles`, verifyToken, deleteRole)

export default roleAPI

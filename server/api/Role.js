import express from 'express'
import { createRole, deleteRole, getRoles, updateRole } from '../controllers/RoleController.js';
import { verifyToken } from '../lib/verifyToken.js';

const roleAPI = express()

roleAPI.get("/role",verifyToken, getRoles);
roleAPI.post("/project/:projectId/role",verifyToken, createRole)
roleAPI.put("/project/:projectId/role/:roleId",verifyToken, updateRole)
roleAPI.delete("/project/:projectId/role", verifyToken, deleteRole)

export default roleAPI

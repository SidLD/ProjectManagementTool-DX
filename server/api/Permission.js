import express from 'express'
    import {verifyToken} from '../lib/verifyToken.js';
import { getUserPermission , generatePermissions, getAllPermissions} from '../controllers/PermissionController.js';
const permissionAPI = express()

permissionAPI.get("/permission", verifyToken, getUserPermission);
permissionAPI.get("/permissions", verifyToken, getAllPermissions);
permissionAPI.post("/permission", verifyToken, generatePermissions)

export default permissionAPI

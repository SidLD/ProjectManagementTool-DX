import express from 'express'
    import {verifyToken} from '../lib/verifyToken.js';
import { getUserPermission , generatePermissions, getAllPermissions} from '../controllers/PermissionController.js';
const permissionAPI = express()
const apiVersion = process.env.API_VERSION;

permissionAPI.get(`/${apiVersion}/permissions`, verifyToken, getUserPermission);
permissionAPI.get(`/${apiVersion}/all-permissions`, verifyToken, getAllPermissions);
permissionAPI.post(`/${apiVersion}/permissions`, verifyToken, generatePermissions)

export default permissionAPI

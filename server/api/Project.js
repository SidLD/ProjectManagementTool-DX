import express from 'express'
import { 
    createProject, 
    deleteProject, 
    getProjects, 
    updateProject } from '../controllers/ProjectController.js';
    import {verifyToken} from '../lib/verifyToken.js';
const projectAPI = express()
const apiVersion = process.env.API_VERSION;

projectAPI.get(`/${apiVersion}/projects`,verifyToken, getProjects);
projectAPI.post(`/${apiVersion}/projects`,verifyToken, createProject)
projectAPI.put(`/${apiVersion}/projects/:projectId`,verifyToken, updateProject)
projectAPI.delete(`/${apiVersion}/projects`, verifyToken, deleteProject)

export default projectAPI

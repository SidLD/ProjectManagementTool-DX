import express from 'express'
import { 
    createProject, 
    deleteProject, 
    getProjects, 
    updateProject } from '../controllers/ProjectController.js';
    import {verifyToken} from '../lib/verifyToken.js';
const projectAPI = express()

projectAPI.get("/project",verifyToken, getProjects);
projectAPI.post("/project",verifyToken, createProject)
projectAPI.put("/project/:projectId",verifyToken, updateProject)
projectAPI.delete("/project", verifyToken, deleteProject)

export default projectAPI

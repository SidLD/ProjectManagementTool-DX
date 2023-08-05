import express from 'express'
const taskAPI = express()
import {verifyToken} from '../lib/verifyToken.js';
import { updateTaskUser, createTask, deleteTask, getTask, updateTask, getAllTasks} from '../controllers/TaskController.js';

taskAPI.get("/project/:projectId/task", verifyToken, getTask)
taskAPI.get("/project/tasks", verifyToken, getAllTasks)
taskAPI.post('/project/:projectId/task', verifyToken, createTask)
taskAPI.delete("/project/:projectId/task",verifyToken, deleteTask)
taskAPI.put("/project/:projectId/task/:taskId",verifyToken, updateTask)
taskAPI.put("/project/:projectId/task/:taskId/member/:method", verifyToken, updateTaskUser);

export default taskAPI

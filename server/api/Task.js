import express from 'express'
const taskAPI = express()
import {verifyToken} from '../lib/verifyToken.js';
import { assignTask, createTask, deleteTask, getTask, updateTask, unscribedTask, getAllTasks} from '../controllers/TaskController.js';

taskAPI.get("/project/:projectId/task", verifyToken, getTask)
taskAPI.get("/project/tasks", verifyToken, getAllTasks)
taskAPI.post('/project/:projectId/task', verifyToken, createTask)
taskAPI.delete("/project/:projectId/task",verifyToken, deleteTask)
taskAPI.put("/project/:projectId/task/:taskId",verifyToken, updateTask)
taskAPI.put("/project/:projectId/task/member", verifyToken, assignTask);
taskAPI.post("/project/:projectId/task/member",verifyToken, unscribedTask);

export default taskAPI

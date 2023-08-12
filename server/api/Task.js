import express from 'express'
const taskAPI = express()
import {verifyToken} from '../lib/verifyToken.js';
import { unsubcribeTask, subcribeTask, createTask, deleteTask, getTask, updateTask, getAllTasks, taskCount} from '../controllers/TaskController.js';

taskAPI.get("/project/:projectId/task", verifyToken, getTask)
taskAPI.get("/project/tasks", verifyToken, getAllTasks)
taskAPI.get("/task/count", verifyToken, taskCount)
taskAPI.post('/project/:projectId/task', verifyToken, createTask)
taskAPI.delete("/project/:projectId/task",verifyToken, deleteTask)
taskAPI.put("/project/:projectId/task/:taskId",verifyToken, updateTask)
taskAPI.put("/project/:projectId/task/:taskId/member/subcribe", verifyToken, subcribeTask);
taskAPI.put("/project/:projectId/task/:taskId/member/unsubcribe", verifyToken, unsubcribeTask);

export default taskAPI

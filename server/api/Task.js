import express from 'express'
const taskAPI = express()
import {verifyToken} from '../lib/verifyToken.js';
import { unsubcribeTask, subcribeTask, createTask, deleteTask, getTask, updateTask, getAllTasks, taskCount} from '../controllers/TaskController.js';

const apiVersion = process.env.API_VERSION;

taskAPI.get(`/${apiVersion}/projects/:projectId/tasks`, verifyToken, getTask)
taskAPI.get(`/${apiVersion}/projects/tasks`, verifyToken, getAllTasks)
taskAPI.get(`/${apiVersion}/tasks/counts`, verifyToken, taskCount)
taskAPI.post(`/${apiVersion}/projects/:projectId/tasks`, verifyToken, createTask)
taskAPI.delete(`/${apiVersion}/projects/:projectId/tasks`,verifyToken, deleteTask)
taskAPI.put(`/${apiVersion}/projects/:projectId/tasks/:taskId`,verifyToken, updateTask)
taskAPI.put(`/${apiVersion}/projects/:projectId/tasks/:taskId/members/subcribe`, verifyToken, subcribeTask);
taskAPI.put(`/${apiVersion}/projects/:projectId/tasks/:taskId/members/unsubcribe`, verifyToken, unsubcribeTask);

export default taskAPI

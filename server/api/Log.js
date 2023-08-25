import express from 'express'
import { verifyToken } from '../lib/verifyToken.js';
import { getLogs } from '../controllers/LogController.js';

const logAPI = express()
const apiVersion = process.env.API_VERSION;

logAPI.get(`/${apiVersion}/tasks/logs`,verifyToken, getLogs);

export default logAPI

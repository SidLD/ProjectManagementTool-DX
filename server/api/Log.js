import express from 'express'
import { verifyToken } from '../lib/verifyToken.js';
import { getLogs } from '../controllers/LogController.js';

const logAPI = express()

logAPI.get("/task/log",verifyToken, getLogs);

export default logAPI

import express from 'express'
import { verifyToken } from '../lib/verifyToken.js';
import { getMention } from '../controllers/MentionController.js';

const mentionAPI = express()

mentionAPI.get("/mention", verifyToken, getMention)

export default mentionAPI

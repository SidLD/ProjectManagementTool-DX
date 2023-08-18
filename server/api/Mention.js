import express from 'express'
import { verifyToken } from '../lib/verifyToken.js';
import { getMention , updateMention, updateAllMention} from '../controllers/MentionController.js';

const mentionAPI = express()

mentionAPI.get("/mention", verifyToken, getMention)
mentionAPI.put("/mention", verifyToken, updateMention)
mentionAPI.put("/mentions", verifyToken, updateAllMention)

export default mentionAPI

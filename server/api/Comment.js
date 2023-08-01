import express from 'express'
import { verifyToken } from '../lib/verifyToken.js';
import { creatComment , getComment} from '../controllers/CommentController.js';

const commentAPI = express()

commentAPI.post("/task/:taskId/comment",verifyToken, creatComment);
commentAPI.get("/task/:taskId/comment", verifyToken, getComment)
export default commentAPI

import express from 'express'
import { verifyToken } from '../lib/verifyToken.js';
import { createComment , getComment, replyComment} from '../controllers/CommentController.js';

const commentAPI = express()

commentAPI.post("/task/:taskId/comment",verifyToken, createComment);
commentAPI.post("/task/:taskId/comment/reply",verifyToken, replyComment);
commentAPI.get("/task/:taskId/comment", verifyToken, getComment)
export default commentAPI

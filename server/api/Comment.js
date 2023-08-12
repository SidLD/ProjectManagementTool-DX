import express from 'express'
import { verifyToken } from '../lib/verifyToken.js';
import { createComment , getComment, getReplyComment, replyComment} from '../controllers/CommentController.js';

const commentAPI = express()
//Prisma Mysql does not support recurssion so we need to manually fetch reply every comment
commentAPI.post("/task/:taskId/comment",verifyToken, createComment);
commentAPI.post("/task/:taskId/comment/reply",verifyToken, replyComment);
commentAPI.get("/task/comment/:commentId/reply", verifyToken, getReplyComment)
commentAPI.get("/task/:taskId/comment", verifyToken, getComment)
export default commentAPI

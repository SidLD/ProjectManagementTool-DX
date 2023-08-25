import express from 'express'
import { verifyToken } from '../lib/verifyToken.js';
import { createComment , getComment, getReplyComment, replyComment} from '../controllers/CommentController.js';

const commentAPI = express()
const apiVersion = process.env.API_VERSION;

//Prisma Mysql does not support recurssion so we need to manually fetch reply every comment
commentAPI.post(`/${apiVersion}/tasks/:taskId/comments`,verifyToken, createComment);
commentAPI.post(`/${apiVersion}/tasks/:taskId/comments/reply`,verifyToken, replyComment);
commentAPI.get(`/${apiVersion}/tasks/comments/:commentId/reply`, verifyToken, getReplyComment)
commentAPI.get(`/${apiVersion}/tasks/:taskId/comments`, verifyToken, getComment)
export default commentAPI

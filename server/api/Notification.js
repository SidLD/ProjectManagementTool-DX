import express from 'express'
import { verifyToken } from '../lib/verifyToken.js';
import { getAllNotification , updateNotifications, updateAllMention} from '../controllers/NotificationController.js';

const notificationAPI = express()
const apiVersion = process.env.API_VERSION;

notificationAPI.get(`/${apiVersion}/notifications`, verifyToken, getAllNotification)
notificationAPI.put(`/${apiVersion}/notifications/:notificationId`, verifyToken, updateNotifications)
notificationAPI.put(`/${apiVersion}/all-mentions`, verifyToken, updateAllMention)

export default notificationAPI

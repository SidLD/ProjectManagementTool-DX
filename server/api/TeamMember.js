import express from 'express'
import { addTeamMember, getTeamMembers } from '../controllers/TeamMemberController.js';
import {verifyToken} from '../lib/verifyToken.js';
const teamMemberAPI = express()
teamMemberAPI.post("/project/:projectId/member", verifyToken, addTeamMember)
teamMemberAPI.get("/project/member", verifyToken, getTeamMembers)
export default teamMemberAPI

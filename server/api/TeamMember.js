import express from 'express'
import { addTeamMember, getTeamMembers, updateTeamMember, deleteTeamMember } from '../controllers/TeamMemberController.js';
import {verifyToken} from '../lib/verifyToken.js';
const teamMemberAPI = express()
teamMemberAPI.post("/project/:projectId/member", verifyToken, addTeamMember)
teamMemberAPI.put("/project/:projectId/member/:memberId", verifyToken, updateTeamMember)
teamMemberAPI.delete("/project/:projectId/member", verifyToken, deleteTeamMember)
teamMemberAPI.get("/project/member", verifyToken, getTeamMembers)
export default teamMemberAPI

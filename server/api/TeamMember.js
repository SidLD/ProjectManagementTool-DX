import express from 'express'
import { addTeamMember, getTeamMembers, updateTeamMember, deleteTeamMember, updateTeamStatus } from '../controllers/TeamMemberController.js';
import {verifyToken} from '../lib/verifyToken.js';
const teamMemberAPI = express()
const apiVersion = process.env.API_VERSION;

teamMemberAPI.post(`/${apiVersion}/projects/:projectId/members`, verifyToken, addTeamMember)
teamMemberAPI.put(`/${apiVersion}/projects/:projectId/members/:memberId`, verifyToken, updateTeamMember)
teamMemberAPI.delete(`/${apiVersion}/projects/:projectId/members`, verifyToken, deleteTeamMember)
teamMemberAPI.put(`/${apiVersion}/members/:teamId/status`, updateTeamStatus)
teamMemberAPI.get(`/${apiVersion}/projects/members`, verifyToken, getTeamMembers)
export default teamMemberAPI

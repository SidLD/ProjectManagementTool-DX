import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'

//Setup
const app = express()
dotenv.config()
app.use(bodyParser.json(), bodyParser.urlencoded({extended:false}));
app.use(cors())
app.use(express.json());
//

//START of API
import userAPI from './api/User.js';
import projectAPI from './api/Project.js'
import roleAPI from './api/Role.js'
import taskAPI from './api/Task.js'
import teamMemberAPI from './api/TeamMember.js'
import permissionAPI from './api/Permission.js'
import logAPI from './api/Log.js'
/* Uncomment this to Generate All Permissions - Cid
import { generateDefaultPermissions } from './repository/PermissionRepository.js'
generateDefaultPermissions()
*/
app.use(logAPI)
app.use(permissionAPI)
app.use(userAPI)
app.use(projectAPI)
app.use(roleAPI)
app.use(taskAPI)
app.use(teamMemberAPI)
//END of API
app.post('*', (req, res) => {
    res.status(401).send({message: "URI not FOUND"})
})
app.get('*', (req, res) => {
    res.status(401).send({message: "URI not FOUND"})
})
app.put('*', (req, res) => {
    res.status(401).send({message: "URI not FOUND"})
})
app.delete('*', (req, res) => {
    res.status(401).send({message: "URI not FOUND"})
})

const port = process.env.PORT
app.listen(port, () => 
    console.log("🔥Server is running on http:localhost:"+port)
);

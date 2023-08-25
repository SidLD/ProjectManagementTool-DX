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
import commentAPI from './api/Comment.js'
import notificationAPI from './api/Notification.js'


// Socket IO for Real Time HTTPS
import { createServer } from 'http'
import { Server } from 'socket.io'
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

import { removeUser, addUser, getClients} from './lib/ClientBuckets.js'
import { createNotifcation } from './repository/NotificationRepository.js'
io.on("connection", (socket) => {
    socket.on("login", async (data) => {
        addUser(data.userId)
        await Promise.all(
            data.projectIds.map((ids) => {
                socket.join(ids)
                io.sockets.in(ids).emit('newLoginUser', `⚡: Someone Joined to Room ${ids}`);
            })
        )
    })
    socket.on('logout', async (data) => {
        removeUser(data.userId)
        await Promise.all(
            data.projectIds.map((ids) => {
                socket.leave(ids)
                io.sockets.in(ids).emit('removeUser', `⚡: Someone Left to Room ${ids}`);
            })
        )
    })
    socket.on("createComment", (data) => {
        io.sockets.in(data.taskId).emit('newComment',data);
    })
    socket.on('createMention',async (data) => {
        socket.broadcast.emit('newMention', data = data.map(mentioned => (mentioned.userId)))
    })
    socket.on("createTask", (data) => {
        console.log(`⚡: A New Comment ${data}`);
        socket.broadcast.emit('newTask', "From Server")
    })
    socket.on("joinRoom", (taskId) => {
        console.log(`⚡: Someone Joined to Room `, taskId);
        socket.join(taskId)
        io.sockets.in(taskId).emit('connectToRoom', `⚡: Someone Joined to Room ${taskId}`);

    })
});

//END of SOCKET IO
app.use(notificationAPI)
app.use(commentAPI)
app.use(logAPI)
app.use(permissionAPI)
app.use(userAPI)
app.use(projectAPI)
app.use(roleAPI)
app.use(taskAPI)
app.use(teamMemberAPI)
//END of API
app.post('*', (req, res) => {
    res.status(404).send({message: "URI not FOUND"})
})
app.get('*', (req, res) => {
    res.status(404).send({message: "URI not FOUND"})
})
app.put('*', (req, res) => {
    res.status(404).send({message: "URI not FOUND"})
})
app.delete('*', (req, res) => {
    res.status(404).send({message: "URI not FOUND"})
})

const port = process.env.PORT

httpServer.listen(port, () => {
    console.log(`Running at port  ${port}`)
});

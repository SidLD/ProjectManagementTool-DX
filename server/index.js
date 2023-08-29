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
import { getUserConnectedUsers } from './repository/UserRepository.js'

io.on("connection", (socket) => {
    socket.on("login", async (userId) => {
        addUser(userId)
        socket.join(userId)
        const users = await getUserConnectedUsers(userId)
        
        Promise.all(
            users.map(async user => {
                io.sockets.to(user).emit('newUser', `⚡`);
            })
        )
    })

    socket.on('logout', async (userId) => {
        removeUser(userId)
        socket.leave(userId)
        const users = await getUserConnectedUsers(userId)
        
        Promise.all()
            users.map(async (user) => {
                io.sockets.to(user).emit('removeUser', `⚡`);
            }
        )

    })

    socket.on("createComment", (data) => {
        io.sockets.in(data.taskId).emit('newComment',data);
    })
    
    socket.on('createReply', (data) => {
        io.sockets.in(data.taskId).emit('newReply',data);
    })

    socket.on('createNotification',async (data) => {
       Promise.all(
        data.map(async id => io.sockets.in(id).emit('newNotification', id))
       )
    })

    socket.on("joinRoom", (taskId) => {
        socket.join(taskId)
        io.sockets.in(taskId).emit('connectToRoom', `⚡: Someone Joined to Task Room ${taskId}`);

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

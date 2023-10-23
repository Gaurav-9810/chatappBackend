import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { dbConnection } from './db.controller.js';
import  router  from './routes.js';
import { Message } from './Model/messageSchema.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const users=[{}];
// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests, if needed
app.use('/Oauth', router);

app.get('/', (req, res) => {
  res.send('Hello, it\'s working'); // Corrected the response text
});

const server = http.createServer(app);
const io = new Server(server); // Corrected the initialization of Socket.IO

io.on('connection', (socket) => {
  console.log('New Connection');

  socket.on('joined', ({ name }) => {
    /*users[socket.id] = user;*/
    console.log(`${name} has joined`);
    socket.broadcast.emit('userJoined', { user: 'Admin', message: `${name} has joined` });
    socket.emit('welcome', { user: 'Admin', message: `Welcome to the chat, ${name}` });
  });

  socket.on('message', async ({ message, id ,name }) => {
    // const user = users[id];

    const newMessage = new Message({
      user: name,
      message: message,
    });

    try {
      await newMessage.save();
      io.emit('sendMessage', { user: name, message, id });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('leave', { user: 'Admin', message: `someone  has left the chat` });
    console.log(`User disconnected: ${socket.id}`);
   
  });
});

server.listen(port, () => {
  console.log(`Server is working on port ${port}`);
 
  dbConnection(process.env.MONGO_DB_URI);
});

const http=require('http');
const express=require('express');
const cors=require('cors');
const socketIO=require('socket.io');



const app=express();
const port=5000||process.env.PORT;

const users=[{}];

app.use(cors());

app.get('/',(req,res)=>{
      res.send('Hell its working');
})

const server=http.createServer(app);

const io=socketIO(server);

io.on("connection",(socket)=>{
      console.log('new Connection');
      socket.on('joined',({user})=>{
            users[socket.id]=user;
            console.log(`${user} has joined`);
            //iss socket id ko chod krr sbko broadcast krdo
            socket.broadcast.emit('userJoined',{user:"Admin" , message:`${users[socket.id]} has joined`})
            socket.emit('welcome',{user:"Admin",message:`welcome to the chat ${users[socket.id]}`})
      })

      socket.on('message',({message,id})=>{
            // sblo message send krne ke liye 
           // if we used broadcast then message will broadcast to all user except itself
            // if we used emit then it will send message to itself only 
            io.emit('sendMessage',{user:users[id],message , id})
      })

      
      socket.on('disconnect', () => {
            socket.broadcast.emit('leave' , {user:"Admin", message:`${users[socket.id]} has left the chat`})
            console.log(`User disconnected: ${socket.id}`);
          });

})

server.listen(port,()=>{
      console.log(`server is working on ${port}`);
})
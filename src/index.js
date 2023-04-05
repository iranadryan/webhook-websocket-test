import express from 'express';
import http from 'node:http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

io.on('connection', (socket) => {
  console.log(`A new user connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  })
});

app.post('/hook', (req, res) => {
  console.log(`New ${req.body.type} arrived from webhook`);
  
  io.emit('newmessage', JSON.stringify(req.body));

  res.sendStatus(200);
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
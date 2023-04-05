import express from 'express';
import { WebSocketServer } from 'ws';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const wss = new WebSocketServer({
  port: 8080,
});

let sockets = [];
wss.on('connection', (socket) => {
  sockets.push(socket);

  socket.on('close', () => {
    sockets = sockets.filter((s) => s !== socket);
  })
});

app.post('/hook', (req, res) => {
  console.log(req.body);
  sockets.forEach((socket) => {
    socket.send(req.body);
  })
  
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})

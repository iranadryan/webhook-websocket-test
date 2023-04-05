import express from 'express';
import { WebSocketServer } from 'ws';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const wss = new WebSocketServer({
  noServer: true
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
    socket.send(JSON.stringify(req.body));
  })
  
  res.sendStatus(200);
});

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  });
});

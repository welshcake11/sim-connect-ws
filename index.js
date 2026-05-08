const http = require('http');
const socketIo = require('socket.io');

const hostname = '127.0.0.1';
const port = 3000;

// Create HTTP server
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('WebSocket server is running\n');
});

// Create Socket.IO server with CORS enabled
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

// Send a message every 10 seconds to all connected clients
setInterval(() => {
  const message = `Hello from server! Timestamp: ${new Date().toISOString()}`;
  io.emit('message', message);
  console.log('Sent message:', message);
}, 10000);

// Start the server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
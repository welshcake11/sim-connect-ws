# Sim Connect WebSocket Server

A simple WebSocket server that sends a message to connected clients every 10 seconds using Socket.IO.

## Installation

Make sure you have Node.js installed (preferably version 20.17.0 or higher for compatibility with node-simconnect).

Install dependencies:
```bash
npm install
```

## Running the Server

Start the server:
```bash
node index.js
```

The server will start on `http://127.0.0.1:3000` and begin sending messages every 10 seconds.

## Connecting a Client

### JavaScript/Node.js Client

Install the Socket.IO client:
```bash
npm install socket.io-client
```

Example client code:
```javascript
const io = require('socket.io-client');

// Connect to the server
const socket = io('http://127.0.0.1:3000');

// Listen for messages
socket.on('message', (data) => {
  console.log('Received:', data);
});

// Handle connection
socket.on('connect', () => {
  console.log('Connected to server');
});

// Handle disconnection
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
```

### Browser Client

Create an HTML file with the following content:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Socket.IO Client</title>
    <script src="https://cdn.socket.io/4.8.3/socket.io.min.js"></script>
</head>
<body>
    <h1>WebSocket Client</h1>
    <div id="messages"></div>

    <script>
        const socket = io('http://127.0.0.1:3000');
        const messagesDiv = document.getElementById('messages');

        socket.on('message', (data) => {
            const messageElement = document.createElement('p');
            messageElement.textContent = `Received: ${data}`;
            messagesDiv.appendChild(messageElement);
        });

        socket.on('connect', () => {
            const statusElement = document.createElement('p');
            statusElement.textContent = 'Connected to server';
            messagesDiv.appendChild(statusElement);
        });

        socket.on('disconnect', () => {
            const statusElement = document.createElement('p');
            statusElement.textContent = 'Disconnected from server';
            messagesDiv.appendChild(statusElement);
        });
    </script>
</body>
</html>
```

Open this HTML file in a web browser to connect and receive messages.

## Message Format

The server sends messages with the event name `'message'` containing a string like:
```
"Hello from server! Timestamp: 2026-05-08T12:34:56.789Z"
```

## Dependencies

- `socket.io`: WebSocket library for real-time communication
- `node-simconnect`: (Currently not used in this simplified version)</content>
<parameter name="filePath">c:\Users\phill\repos\sim-connect-ws\README.md
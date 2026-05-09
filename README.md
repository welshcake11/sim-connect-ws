# Sim Connect WebSocket Server

A simple WebSocket server that sends altitude updates to connected clients every second using the ws library.

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

The server will start on `http://127.0.0.1:3000` and begin sending altitude updates every 10 seconds.

## Testing with the Mock SimConnect Server

To run the app with a mock SimConnect server instead of a real simulator, set the `SIMCONNECT_MOCK` environment variable:

- PowerShell:
  ```powershell
  $env:SIMCONNECT_MOCK = '1'
  node index.js
  ```
- Bash:
  ```bash
  SIMCONNECT_MOCK=1 node index.js
  ```

This starts the same ws-based WebSocket server and sends synthetic altitude values every second to the app, which then forwards them every second to connected clients.

## Connecting a Client

### JavaScript/Node.js Client

Install the ws client:
```bash
npm install ws
```

Example client code:
```javascript
const WebSocket = require('ws');

// Connect to the server
const socket = new WebSocket('ws://127.0.0.1:3000');

socket.on('open', () => {
  console.log('Connected to server');
});

socket.on('message', (message) => {
  const data = JSON.parse(message.toString());
  if (data.altitude === null) {
    console.log('Waiting for SimConnect data:', data.message);
  } else {
    console.log('Received altitude:', data.altitude, 'feet');
  }
});

socket.on('close', () => {
  console.log('Disconnected from server');
});
```

### Browser Client

Create an HTML file with the following content:

```html
<!DOCTYPE html>
<html>
<head>
    <title>WebSocket Client</title>
</head>
<body>
    <h1>WebSocket Client</h1>
    <div id="messages"></div>

    <script>
        const socket = new WebSocket('ws://127.0.0.1:3000');
        const messagesDiv = document.getElementById('messages');

        socket.addEventListener('open', () => {
            const statusElement = document.createElement('p');
            statusElement.textContent = 'Connected to server';
            messagesDiv.appendChild(statusElement);
        });

        socket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            const messageElement = document.createElement('p');
            if (data.altitude === null) {
                messageElement.textContent = `Waiting for SimConnect data: ${data.message}`;
            } else {
                messageElement.textContent = `Received altitude: ${data.altitude} feet | ${data.timestamp}`;
            }
            messagesDiv.appendChild(messageElement);
        });

        socket.addEventListener('close', () => {
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

The server sends JSON messages containing an object such as:
```
{
  altitude: 12345.67,
  timestamp: '2026-05-08T12:34:56.789Z'
}
```

## Dependencies

- `ws`: WebSocket library for real-time communication
- `node-simconnect`: SimConnect client library used to read simulator altitude data</content>
<parameter name="filePath">c:\Users\phill\repos\sim-connect-ws\README.md
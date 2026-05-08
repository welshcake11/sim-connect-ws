const http = require('http');
const socketIo = require('socket.io');

const useMockSimconnect = process.env.SIMCONNECT_MOCK === '1' || process.env.SIMCONNECT_MOCK === 'true';
const simconnect = useMockSimconnect
  ? require('./mock-simconnect-server')
  : require('node-simconnect');
const { open, Protocol, SimConnectConstants, SimConnectDataType, SimConnectPeriod } = simconnect;

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
    methods: ['GET', 'POST'],
  },
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

let latestAltitude = null;
const ALTITUDE_DEFINITION_ID = 1;
const ALTITUDE_REQUEST_ID = 1;

open('SimConnect Altitude Bridge', Protocol.FSX_SP2)
  .then(({ recvOpen, handle }) => {
    console.log('Connected to SimConnect:', recvOpen.applicationName);

    handle.on('exception', (error) => {
      console.error('SimConnect exception:', error);
    });

    handle.on('quit', () => {
      console.log('Simulator quit');
    });

    handle.on('close', () => {
      console.log('SimConnect connection closed');
    });

    handle.on('simObjectData', (recvSimObjectData) => {
      if (recvSimObjectData.requestID !== ALTITUDE_REQUEST_ID) {
        return;
      }

      const altitude = recvSimObjectData.data.readFloat64();
      latestAltitude = altitude;
      console.log('Altitude updated:', altitude);
    });

    handle.addToDataDefinition(
      ALTITUDE_DEFINITION_ID,
      'Indicated Altitude',
      'feet',
      SimConnectDataType.FLOAT64
    );

    handle.requestDataOnSimObject(
      ALTITUDE_REQUEST_ID,
      ALTITUDE_DEFINITION_ID,
      SimConnectConstants.OBJECT_ID_USER,
      SimConnectPeriod.SECOND
    );
  })
  .catch((error) => {
    console.error('Failed to connect to SimConnect:', error);
  });

// Send altitude every 10 seconds to all connected clients
setInterval(() => {
  const payload = latestAltitude === null
    ? {
      altitude: null,
      message: 'Waiting for SimConnect data',
      timestamp: new Date().toISOString(),
    }
    : {
      altitude: latestAltitude,
      timestamp: new Date().toISOString(),
    };

  io.emit('altitude', payload);
  console.log('Sent altitude:', payload);
}, 1000);

// Start the server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
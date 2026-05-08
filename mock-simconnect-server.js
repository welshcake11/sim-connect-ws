const EventEmitter = require('events');

const Protocol = {
  FSX_SP2: 0,
};

const SimConnectConstants = {
  OBJECT_ID_USER: 0,
  UNUSED: 0xffffffff,
};

const SimConnectDataType = {
  FLOAT64: 4,
};

const SimConnectPeriod = {
  SECOND: 4,
};

class MockRawBuffer {
  constructor(value) {
    this.buffer = Buffer.alloc(8);
    this.buffer.writeDoubleLE(value, 0);
    this.offset = 0;
  }

  readFloat64() {
    const value = this.buffer.readDoubleLE(this.offset);
    this.offset += 8;
    return value;
  }
}

class MockHandle extends EventEmitter {
  constructor() {
    super();
    this._interval = null;
    this._definitionIds = new Set();
  }

  addToDataDefinition(dataDefinitionId, datumName, unitsName, dataType) {
    this._definitionIds.add(dataDefinitionId);
    return Promise.resolve();
  }

  requestDataOnSimObject(dataRequestId, dataDefinitionId, objectId, period) {
    if (!this._definitionIds.has(dataDefinitionId)) {
      throw new Error(`Data definition ${dataDefinitionId} has not been registered`);
    }

    if (this._interval) {
      clearInterval(this._interval);
    }

    let altitude = 1000;
    this._interval = setInterval(() => {
      altitude += 100 + Math.random() * 50;
      const data = new MockRawBuffer(altitude);
      this.emit('simObjectData', {
        requestID: dataRequestId,
        data,
      });
    }, period === SimConnectPeriod.SECOND ? 1000 : 10000);

    return Promise.resolve();
  }
}

function open(appName, protocolVersion, options) {
  return new Promise((resolve) => {
    const handle = new MockHandle();
    const recvOpen = { applicationName: appName };

    setImmediate(() => {
      resolve({ recvOpen, handle });
    });
  });
}

module.exports = {
  open,
  Protocol,
  SimConnectConstants,
  SimConnectDataType,
  SimConnectPeriod,
};

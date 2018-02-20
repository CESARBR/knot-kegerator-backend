import MeshbluSocketIO from 'meshblu';

class CloudConnection {
  constructor(hostname, port, uuid, token) {
    this.connection = new MeshbluSocketIO({
      resolveSrv: false,
      protocol: 'ws',
      hostname,
      port,
      uuid,
      token,
    });
  }

  start() {
    this.connection.connect();

    return new Promise((resolve, reject) => {
      this.connection.on('ready', () => resolve());
      this.connection.on('notReady', () => reject());
    });
  }

  close() {
    return new Promise((resolve) => {
      this.connection.close(() => resolve());
    });
  }

  on(event) {
    return new Promise((resolve) => {
      this.connection.on(event, result => resolve(result));
    });
  }

  update(query) {
    return new Promise((resolve) => {
      this.connection.update(query, result => resolve(result));
    });
  }

  device(query) {
    return new Promise((resolve, reject) => {
      this.connection.device(query, (result) => {
        if (!result.device) {
          return reject(result.error);
        }
        return resolve(result.device.metadata);
      });
    });
  }

  subscribe(query) {
    this.connection.subscribe(query);
  }

  unsubscribe(query) {
    this.connection.unsubscribe(query);
  }
}

export default CloudConnection;

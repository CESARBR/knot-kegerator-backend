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

  close(callback) {
    this.connection.close(callback);
  }

  on(event, callback) {
    this.connection.on(event, callback);
  }

  update(query, callback) {
    this.connection.update(query, callback);
  }

  device(query, callback) {
    this.connection.device(query, callback);
  }
}

export default CloudConnection;

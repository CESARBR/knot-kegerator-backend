import MeshbluSocketIO from 'meshblu';
import Logger from 'infrastructure/Logger';

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
    Logger.debug('info', 'starting cloud connection');
    this.connection.connect();

    return new Promise((resolve, reject) => {
      this.connection.on('ready', () => {
        Logger.debug('info', 'cloud connection established');
        resolve();
      });

      this.connection.on('notReady', () => {
        Logger.debug('error', 'cloud connection not authorized');
        reject();
      });
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

/* eslint-disable no-console */
import meshblu from 'meshblu';

class CloudConnection {
  constructor(company) {
    this.server = company.server;
    this.port = company.port;
    this.uuid = company.uuid;
    this.token = company.token;
  }

  start() {
    this.connection = meshblu.createConnection({
      server: this.server,
      port: this.port,
      uuid: this.uuid,
      token: this.token,
    });

    this.connection.on('ready', () => {
      console.log('Cloud connection successful');
    });

    this.connection.on('notReady', () => {
      console.log('Cloud connection failed');
    });

    return this.connection;
  }
}

export default CloudConnection;

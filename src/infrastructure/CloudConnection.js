/* eslint-disable no-console */
import meshblu from 'meshblu';

let instance = null;

class CloudConnection {
  constructor(company) {
    if (!instance) {
      this.company = company;
      this.connection = this.start(company);
      instance = this;
    }
    return instance;
  }

  start() {
    const meshbluConnection = meshblu.createConnection({
      server: this.company.server,
      port: this.company.port,
      uuid: this.company.uuid,
      token: this.company.token,
    });

    return meshbluConnection;
  }

  close() {
    this.connection.close(() => {});
  }
}

export default CloudConnection;

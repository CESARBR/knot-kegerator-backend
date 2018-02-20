/* eslint-disable no-console */
class CloudTapStore {
  constructor(connection) {
    this.connection = connection;
  }

  getTap(tap) {
    return new Promise((resolve, reject) => {
      this.connection.on('ready', () => {
        this.connection.device({ uuid: tap.id }, (result) => {
          if (!result.device) {
            reject(result.error);
          }
          resolve(result.device.metadata);
        });
      });
    });
  }

  setupTap(tap) {
    this.connection.on('ready', () => {
      this.connection.update({
        uuid: tap.id,
        'metadata.setup': tap.setup,
      }, () => {
        console.log(`Tap ${tap.name} updated on cloud`);
      });
    });
  }
}

export default CloudTapStore;

import Logger from 'infrastructure/Logger';

/* eslint-disable no-console */
class CloudTapStore {
  constructor(connection) {
    this.connection = connection;
  }

  getTap(id) {
    return new Promise((resolve, reject) => {
      this.connection.device({ uuid: id }, (result) => {
        if (!result.device) {
          Logger.debug('error', 'device not found in the cloud');
          return reject(result.error);
        }

        Logger.debug('info', `device ${result.device.metadata.name} received from cloud`);

        return resolve(result.device.metadata);
      });
    });
  }

  updateTap(tap) {
    return new Promise((resolve) => {
      this.connection.update({
        uuid: tap.id,
        'metadata.setup': tap.setup,
      }, (result) => {
        Logger.debug('info', `tap ${tap.name} updated on cloud`);
        resolve(result);
      });
    });
  }
}

export default CloudTapStore;

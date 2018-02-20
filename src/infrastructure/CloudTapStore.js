/* eslint-disable no-console */
class CloudTapStore {
  constructor(connection) {
    this.connection = connection;
  }

  getTap(id) {
    return new Promise((resolve, reject) => {
      this.connection.device({ uuid: id }, (result) => {
        if (!result.device) {
          return reject(result.error);
        }
        return resolve(result.device.metadata);
      });
    });
  }

  updateTap(tap) {
    return new Promise((resolve) => {
      this.connection.update({
        uuid: tap.id,
        'metadata.setup': tap.setup,
      }, result => resolve(result));
    });
  }
}

export default CloudTapStore;

/* eslint-disable no-console */
class CloudTapStore {
  constructor(connection) {
    this.connection = connection;
  }

  getTap(id, callback) {
    this.connection.device({ uuid: id }, (result) => {
      if (!result.device) {
        return callback(result.error, null);
      }
      const data = result.device.metadata;
      return callback(null, data);
    });
  }

  async setupTap(tap) {
    this.connection.update({
      uuid: tap.id,
      'metadata.setup': {
        clientId: tap.clientId,
        beerId: tap.beerId,
        kegId: tap.kegId,
      },
    }, () => {
      this.connection.close(() => {});
    });
  }
}

export default CloudTapStore;

class CloudTapStore {
  constructor(connection) {
    this.connection = connection;
  }

  async get(id) {
    return this.connection.device({ uuid: id });
  }

  async update(tap) {
    return this.connection.update({
      uuid: tap.id,
      'metadata.setup': tap.setup,
    });
  }
}

export default CloudTapStore;

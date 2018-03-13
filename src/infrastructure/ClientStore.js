import ClientSchema from 'infrastructure/ClientSchema';

class ClientStore {
  constructor(connection) {
    this.connection = connection;
  }

  async exists(id) {
    const result = await this.connection.count('Client', ClientSchema, { id });
    if (!result) {
      return false;
    }

    return true;
  }
}

export default ClientStore;

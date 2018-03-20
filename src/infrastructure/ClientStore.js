import ClientSchema from 'infrastructure/ClientSchema';

class ClientStore {
  constructor(connection) {
    this.connection = connection;
  }

  async getAll() {
    const result = await this.connection.find('Client', ClientSchema);
    return result;
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

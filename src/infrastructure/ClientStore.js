import ClientSchema from 'infrastructure/ClientSchema';

class ClientStore {
  constructor(connection) {
    this.connection = connection;
  }

  async exists(id) {
    return !!await this.connection.count('Client', ClientSchema, { id });
  }
}

export default ClientStore;

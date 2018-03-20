import KegSchema from 'infrastructure/KegSchema';

class KegStore {
  constructor(connection) {
    this.connection = connection;
  }

  async list() {
    return this.connection.find('Keg', KegSchema);
  }

  async exists(id) {
    return !!await this.connection.count('Keg', KegSchema, { id });
  }

  async get(id) {
    return this.connection.findOne('Keg', KegSchema, { id });
  }
}

export default KegStore;

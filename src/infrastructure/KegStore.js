import KegSchema from 'infrastructure/KegSchema';

class KegStore {
  constructor(connection) {
    this.connection = connection;
  }

  async exists(id) {
    return !!await this.connection.count('Keg', KegSchema, { id });
  }
}

export default KegStore;

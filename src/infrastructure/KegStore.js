import KegSchema from 'infrastructure/KegSchema';

class KegStore {
  constructor(connection) {
    this.connection = connection;
  }

  async getAll() {
    const result = await this.connection.find('Keg', KegSchema);
    return result;
  }

  async exists(id) {
    const result = await this.connection.count('Keg', KegSchema, { id });
    if (!result) {
      return false;
    }

    return true;
  }
}

export default KegStore;

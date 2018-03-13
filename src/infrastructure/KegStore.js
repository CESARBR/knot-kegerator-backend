import KegSchema from 'infrastructure/KegSchema';

class KegStore {
  constructor(connection) {
    this.connection = connection;
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

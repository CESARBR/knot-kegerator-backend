import BeerSchema from 'infrastructure/BeerSchema';

class BeerStore {
  constructor(connection) {
    this.connection = connection;
  }

  async getAll() {
    const result = await this.connection.find('Beer', BeerSchema);
    return result;
  }

  async exists(id) {
    const result = await this.connection.count('Beer', BeerSchema, { id });
    if (!result) {
      return false;
    }

    return true;
  }
}

export default BeerStore;

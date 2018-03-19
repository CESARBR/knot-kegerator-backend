import BeerSchema from 'infrastructure/BeerSchema';

class BeerStore {
  constructor(connection) {
    this.connection = connection;
  }

  async list() {
    const result = await this.connection.find('Beer', BeerSchema);
    return result;
  }

  async exists(id) {
    return !!await this.connection.count('Beer', BeerSchema, { id });
  }
}

export default BeerStore;

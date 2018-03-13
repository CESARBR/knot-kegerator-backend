import BeerSchema from 'infrastructure/BeerSchema';

class BeerStore {
  constructor(connection) {
    this.connection = connection;
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

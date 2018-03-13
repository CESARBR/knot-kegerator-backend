import BeerSchema from 'infrastructure/BeerSchema';

class BeerStore {
  constructor(connection) {
    this.connection = connection;
  }

  async exists(id) {
    return !!await this.connection.count('Beer', BeerSchema, { id });
  }

  async get(id) {
    return this.connection.findOne('Beer', BeerSchema, { id });
  }
}

export default BeerStore;

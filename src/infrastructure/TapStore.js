import TapSchema from 'infrastructure/TapSchema';
import EntityNotFoundError from 'entities/EntityNotFoundError';

class TapStore {
  constructor(connection) {
    this.connection = connection;
  }

  async get(id) {
    const result = await this.connection.findOne('Tap', TapSchema, { id });
    if (!result) {
      throw new EntityNotFoundError('Tap', id);
    }

    return result;
  }

  async getAll() {
    const result = await this.connection.find('Tap', TapSchema);
    return result;
  }

  async update(tap) {
    const result = await this.connection.findOneAndUpdate('Tap', TapSchema, { id: tap.id }, tap);
    if (!result) {
      throw new EntityNotFoundError('Tap', tap.id);
    }
  }
}

export default TapStore;

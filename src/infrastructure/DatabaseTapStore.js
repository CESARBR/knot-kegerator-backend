import TapSchema from 'infrastructure/TapSchema';
import DatabaseTap from 'infrastructure/DatabaseTap';
import EntityNotFoundError from 'entities/EntityNotFoundError';

class DatabaseTapStore {
  constructor(connection) {
    this.connection = connection;
  }

  async get(id) {
    const result = await this.connection.findOne('Tap', TapSchema, { id });
    if (!result) {
      throw new EntityNotFoundError('Tap', id);
    }

    return new DatabaseTap(
      result.id,
      result.name,
      result.setup,
    );
  }

  async list() {
    return this.connection.find('Tap', TapSchema);
  }

  async update(tap) {
    const result = await this.connection.findOneAndUpdate('Tap', TapSchema, { id: tap.id }, tap);
    if (!result) {
      throw new EntityNotFoundError('Tap', tap.id);
    }
  }
}

export default DatabaseTapStore;

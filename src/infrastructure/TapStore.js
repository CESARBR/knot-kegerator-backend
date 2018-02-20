import TapSchema from 'infrastructure/TapSchema';

class TapStore {
  constructor(connection) {
    this.connection = connection;
  }

  async getTap(id) {
    const result = await this.connection.findOne('Tap', TapSchema, { id });
    if (!result) {
      const err = new Error('Tap doesn\'t exists on database');
      err.code = 404;
      throw err;
    }

    return result;
  }

  async updateTap(tap) {
    const result = await this.connection.findOneAndUpdate('Tap', TapSchema, { id: tap.id }, tap);
    if (!result) {
      const err = new Error('Tap doesn\'t exists on database');
      err.code = 404;
      throw err;
    }
  }
}

export default TapStore;

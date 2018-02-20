/* eslint-disable no-console */
import TapSchema from 'infrastructure/TapSchema';

class TapStore {
  constructor(connection) {
    this.connection = connection;
  }

  async getTap(id) {
    const model = this.connection.model('Tap', TapSchema);

    const result = await model.findOne({ id });
    if (!result) {
      const err = new Error('Tap doesn\'t exists on database');
      err.code = 404;
      throw err;
    }

    return result;
  }

  async setupTap(tap) {
    const model = this.connection.model('Tap', TapSchema);

    const result = await model.findOneAndUpdate({ id: tap.id }, tap);
    if (!result) {
      const err = new Error('Tap doesn\'t exists on database');
      err.code = 404;
      throw err;
    }
  }
}

export default TapStore;

import TapSchema from 'infrastructure/TapSchema';
import Logger from 'infrastructure/Logger';

class TapStore {
  constructor(connection) {
    this.connection = connection;
  }

  async getTap(id) {
    const result = await this.connection.findOne('Tap', TapSchema, { id });
    if (!result) {
      const err = new Error('Tap doesn\'t exists on database');
      err.code = 404;
      Logger.debug('error', err);
      throw err;
    }

    Logger.debug('info', `device ${result.name} received from database`);

    return result;
  }

  async updateTap(tap) {
    const result = await this.connection.findOneAndUpdate('Tap', TapSchema, { id: tap.id }, tap);
    if (!result) {
      const err = new Error('Tap doesn\'t exists on database');
      Logger.debug('error', err);
      err.code = 404;
      throw err;
    }
    Logger.debug('info', `tap ${tap.name} updated on database`);
  }
}

export default TapStore;

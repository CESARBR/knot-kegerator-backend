/* eslint-disable no-console */
class SetupTap {
  constructor(mongoStore, cloudStore) {
    this.mongoStore = mongoStore;
    this.cloudStore = cloudStore;
  }

  async execute(tap) {
    this.cloudStore.getTap(tap.id, (err, data) => {
      if (err) {
        return console.error(err);
      }
      if (data.waitingSetup === 'false') {
        const error = new Error('Tap doesn\'t in setup mode');
        error.code = 403;
        return console.error(error);
      }
      return data;
    });
    await this.mongoStore.setupTap(tap);
    await this.cloudStore.setupTap(tap);
  }
}

export default SetupTap;

/* eslint-disable no-console */
class SetupTap {
  constructor(mongoStore, cloudStore) {
    this.mongoStore = mongoStore;
    this.cloudStore = cloudStore;
  }

  async execute(tap) {
    if (tap.waitingSetup === false) {
      console.log('erro');
      const error = new Error('Tap doesn\'t in setup mode');
      error.code = 403;
      throw error;
    }
    await this.mongoStore.setupTap(tap);
    await this.cloudStore.setupTap(tap);
  }
}

export default SetupTap;

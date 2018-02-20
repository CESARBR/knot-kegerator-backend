class SetupTap {
  constructor(mongoStore, cloudStore) {
    this.mongoStore = mongoStore;
    this.cloudStore = cloudStore;
  }

  async execute(setup) {
    let tap = await this.cloudStore.getTap(setup.id);
    if (!tap.waitingSetup) {
      const error = new Error('Tap isn\'t in setup mode');
      error.code = 403;
      throw error;
    }

    tap = await this.mongoStore.getTap(setup.id);
    if (!tap.setup.client.id || !tap.setup.beer.id || !tap.setup.keg.id) {
      const error = new Error('ValidationError');
      throw error;
    }

    tap.setup.client.id = setup.clientId;
    tap.setup.beer.id = setup.beerId;
    tap.setup.keg.id = setup.kegId;

    await this.mongoStore.updateTap(tap);
    await this.cloudStore.updateTap(tap);
  }
}

export default SetupTap;

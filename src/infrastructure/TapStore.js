import Tap from 'entities/Tap';

class TapStore {
  constructor(databaseTapStore, cloudTapStore, beerStore, kegStore) {
    this.databaseTapStore = databaseTapStore;
    this.cloudTapStore = cloudTapStore;
    this.beerStore = beerStore;
    this.kegStore = kegStore;
  }

  async get(id) {
    const tapFromCloud = await this.cloudTapStore.get(id);
    const tapFromDatabase = await this.databaseTapStore.get(id);

    const tap = new Tap(
      id,
      tapFromDatabase.name,
      tapFromCloud.waitingSetup,
      tapFromDatabase.setup,
      tapFromCloud.remainingVolume,
    );

    return tap;
  }

  async update(tap) {
    await this.databaseTapStore.update(tap);

    const beer = await this.beerStore.get(tap.setup.beerId);
    const keg = await this.kegStore.get(tap.setup.kegId);

    await this.cloudTapStore.update(tap.id, beer.style, keg.totalVolume);
  }
}

export default TapStore;

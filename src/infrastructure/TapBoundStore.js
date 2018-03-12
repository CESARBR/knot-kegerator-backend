import Tap from 'entities/Tap';

class TapBoundStore {
  constructor(tapStore, cloudTapStore) {
    this.tapStore = tapStore;
    this.cloudTapStore = cloudTapStore;
  }

  async get(id) {
    const tapFromCloud = await this.cloudTapStore.get(id);
    const tapFromDatabase = await this.tapStore.get(id);

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
    await this.tapStore.update(tap);
    await this.cloudTapStore.update(tap);
  }
}

export default TapBoundStore;

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

  async getAll() {
    const tapsFromCloud = await this.cloudTapStore.getAll();
    const tapsFromDatabase = await this.tapStore.getAll();

    const tapsList = [];

    for (let i = 0; i < tapsFromCloud.length; i += 1) {
      const tap = {};
      const tapFromDatabase = tapsFromDatabase.find(t => t.id === tapsFromCloud[i].id);

      tap.id = tapsFromCloud[i].id;

      if (tapFromDatabase) {
        tap.name = tapFromDatabase.name;
        tap.waitingSetup = tapsFromCloud[i].waitingSetup;

        if (!tap.waitingSetup) {
          tap.setup = tapFromDatabase.setup;
          tap.volume = tapsFromCloud[i].volume;
        }
      }

      tapsList.push(tap);
    }

    return tapsList;
  }

  async update(tap) {
    await this.tapStore.update(tap);
    await this.cloudTapStore.update(tap);
  }
}

export default TapBoundStore;

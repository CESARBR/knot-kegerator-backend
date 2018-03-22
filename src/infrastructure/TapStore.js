import Tap from 'entities/Tap';

class TapStore {
  constructor(databaseTapStore, cloudTapStore, clientStore, beerStore, kegStore) {
    this.databaseTapStore = databaseTapStore;
    this.cloudTapStore = cloudTapStore;
    this.clientStore = clientStore;
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

  async list() {
    const tapsFromCloud = await this.cloudTapStore.list();
    const tapsFromDatabase = await this.databaseTapStore.list();

    const tapList = [];

    for (let i = 0; i < tapsFromCloud.length; i += 1) {
      const tap = {};
      const tapFromDatabase = tapsFromDatabase.find(t => t.id === tapsFromCloud[i].id);

      if (tapFromDatabase) {
        tap.id = tapsFromCloud[i].id;
        tap.name = tapFromDatabase.name;
        tap.waitingSetup = tapsFromCloud[i].waitingSetup;

        if (!tap.waitingSetup) {
          tap.setup = {
            clientId: tapFromDatabase.setup.clientId,
            beerId: tapFromDatabase.setup.beerId,
            kegId: tapFromDatabase.setup.kegId,
          };
          tap.volume = tapsFromCloud[i].volume;
        }
      }

      tapList.push(tap);
    }

    return tapList;
  }

  async update(tap) {
    await this.databaseTapStore.update(tap);

    const beer = await this.beerStore.get(tap.setup.beerId);
    const keg = await this.kegStore.get(tap.setup.kegId);

    await this.cloudTapStore.update(tap.id, beer.style, keg.totalVolume);
  }
}

export default TapStore;

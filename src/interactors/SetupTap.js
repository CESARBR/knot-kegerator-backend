import ValidationError from 'entities/ValidationError';
import InvalidStateError from 'entities/InvalidStateError';

class SetupTap {
  constructor(tapStore, clientStore, beerStore, kegStore) {
    this.tapStore = tapStore;
    this.clientStore = clientStore;
    this.beerStore = beerStore;
    this.kegStore = kegStore;
  }

  async execute(setup) {
    const tap = await this.tapStore.get(setup.id);
    if (!tap.waitingSetup) {
      throw new InvalidStateError('tap isn\'t in setup mode', tap.id);
    }

    const client = await this.clientStore.exists(setup.clientId);
    if (!client) {
      throw new ValidationError('\'client\' doesn\'t exist', 'clientId', 'missing');
    }

    const beer = await this.beerStore.exists(setup.beerId);
    if (!beer) {
      throw new ValidationError('\'beer\' doesn\'t exist', 'beerId', 'missing');
    }

    const keg = await this.kegStore.exists(setup.kegId);
    if (!keg) {
      throw new ValidationError('\'keg\' doesn\'t exist', 'kegId', 'missing');
    }

    tap.setup.client.id = setup.clientId;
    tap.setup.beer.id = setup.beerId;
    tap.setup.keg.id = setup.kegId;

    await this.tapStore.update(tap);
  }
}

export default SetupTap;

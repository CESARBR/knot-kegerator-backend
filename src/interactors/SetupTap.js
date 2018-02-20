import Tap from 'entities/Tap';
import Setup from 'entities/Setup';
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

    const tapToUpdate = new Tap(
      tap.id,
      tap.name,
      tap.waitingSetup,
      new Setup(
        setup.clientId,
        setup.beerId,
        setup.kegId,
      ),
      tap.volume,
    );

    await this.tapStore.update(tapToUpdate);
  }
}

export default SetupTap;

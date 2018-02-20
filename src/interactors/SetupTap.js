import ValidationError from 'entities/ValidationError';

function handleValidationError(message, field, code) {
  const error = new ValidationError(
    message,
    {
      field,
      code,
    },
  );
  return error;
}

class SetupTap {
  constructor(mongoStore, cloudStore) {
    this.mongoStore = mongoStore;
    this.cloudStore = cloudStore;
  }

  async execute(setup) {
    const tap = await this.cloudStore.tap.get(setup.id);
    if (!tap) {
      throw new Error('EntityNotFoundError');
    }

    if (!tap.waitingSetup) {
      throw new Error('InvalidStateError');
    }

    const client = await this.mongoStore.client.get(setup.clientId);
    if (!client) {
      throw handleValidationError('\'client\' doesn\'t exist', 'clientId', 'missing');
    }

    const beer = await this.mongoStore.beer.get(setup.beerId);
    if (!beer) {
      throw handleValidationError('\'beer\' doesn\'t exist', 'beerId', 'missing');
    }

    const keg = await this.mongoStore.keg.get(setup.kegId);
    if (!keg) {
      throw handleValidationError('\'keg\' doesn\'t exist', 'kegId', 'missing');
    }

    tap.setup.client.id = setup.clientId;
    tap.setup.beer.id = setup.beerId;
    tap.setup.keg.id = setup.kegId;

    await this.mongoStore.tap.update(tap);
    await this.cloudStore.tap.update(tap);
  }
}

export default SetupTap;

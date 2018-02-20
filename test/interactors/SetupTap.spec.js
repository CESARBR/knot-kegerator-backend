import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import SetupTap from 'interactors/SetupTap';
import Tap from 'entities/Tap';
import Setup from 'entities/Setup';
import Client from 'entities/Client';
import Beer from 'entities/Beer';
import Keg from 'entities/Keg';
import ValidationError from 'entities/ValidationError';
import EntityNotFoundError from 'entities/EntityNotFoundError';

const client = new Client('a42e08c1-d278-444d-9451-72f70d916c61');

const beer = new Beer('b60b53df-caab-41a6-9878-c00e23e504ab');

const keg = new Keg('518b0ef3-c9ae-49d4-8955-7aed96022aaa');

const setup = new Setup(
  client,
  beer,
  keg,
);

const tapSetupMode = new Tap(
  '9392780a-1d43-47a8-ab05-b425eeee96f4',
  'CESAR tap',
  true,
  setup,
  10.5,
);

const tapNoSetupMode = new Tap(
  '9392780a-1d43-47a8-ab05-b425eeee96f4',
  'CESAR tap',
  false,
  setup,
  10.5,
);

function createTest(tapData, clientData, beerData, kegData) {
  return around(tape)
    .before((t) => {
      const mongoStore = {
        tap: {
          get: sinon.stub().resolves(tapData),
          update: sinon.stub().resolves(),
        },
        client: {
          exists: sinon.stub().resolves(clientData),
        },
        beer: {
          exists: sinon.stub().resolves(beerData),
        },
        keg: {
          exists: sinon.stub().resolves(kegData),
        },
      };
      const cloudStore = {
        tap: {
          get: sinon.stub().resolves(tapData),
          update: sinon.stub().resolves(),
        },
      };
      const setupData = {
        id: '9392780a-1d43-47a8-ab05-b425eeee96f4',
        clientId: 'a42e08c1-d278-444d-9451-72f70d916c61',
        beerId: 'b60b53df-caab-41a6-9878-c00e23e504ab',
        kegId: '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
      };


      t.next(mongoStore, cloudStore, setupData);
    });
}

createTest(tapSetupMode, client, beer, keg)(
  'calls updateTap() on store',
  async (t, mongoStore, cloudStore, setupData) => {
    const interactor = new SetupTap(mongoStore, cloudStore);

    await interactor.execute(setupData);

    t.true(mongoStore.tap.update.called);
    t.end();
  },
);

createTest(tapSetupMode, client, beer, keg)(
  'calls updateTap() on store with the setup data',
  async (t, mongoStore, cloudStore, setupData) => {
    const interactor = new SetupTap(mongoStore, cloudStore);

    await interactor.execute(setupData);
    const actualTap = mongoStore.tap.update.getCall(0).args[0];

    t.deepEqual(actualTap, tapSetupMode);
    t.end();
  },
);


createTest(null, client, beer, keg)(
  'throws EntityNotFoundError if tap entity isn\'t found',
  async (t, mongoStore, cloudStore, setupData) => {
    const interactor = new SetupTap(mongoStore, cloudStore);

    try {
      await interactor.execute(setupData);
      t.fail('should throw');
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        t.pass('should throw');
      } else {
        t.fail('should throw');
      }
    }

    t.end();
  },
);


createTest(tapNoSetupMode, client, beer, keg)(
  'throws InvalidStateError if tap isn\'t in setup mode',
  async (t, mongoStore, cloudStore, setupData) => {
    const interactor = new SetupTap(mongoStore, cloudStore);

    try {
      await interactor.execute(setupData);
      t.fail('should throw');
    } catch (e) {
      if (e.message === 'InvalidStateError') {
        t.pass('should throw');
      } else {
        t.fail('should throw');
      }
    }

    t.end();
  },
);

createTest(tapSetupMode, null, beer, keg)(
  'throws ValidationError if client entity is missing',
  async (t, mongoStore, cloudStore, setupData) => {
    const interactor = new SetupTap(mongoStore, cloudStore);

    try {
      await interactor.execute(setupData);
      t.fail('should throw');
    } catch (e) {
      if (e instanceof ValidationError && e.details.field === 'clientId') {
        t.pass('should throw');
      } else {
        t.fail('should throw');
      }
    }

    t.end();
  },
);

createTest(tapSetupMode, client, null, keg)(
  'throws ValidationError if beer entity is missing',
  async (t, mongoStore, cloudStore, setupData) => {
    const interactor = new SetupTap(mongoStore, cloudStore);

    try {
      await interactor.execute(setupData);
      t.fail('should throw');
    } catch (e) {
      if (e instanceof ValidationError && e.details.field === 'beerId') {
        t.pass('should throw');
      } else {
        t.fail('should throw');
      }
    }

    t.end();
  },
);

createTest(tapSetupMode, client, beer, null)(
  'throws ValidationError if keg entity is missing',
  async (t, mongoStore, cloudStore, setupData) => {
    const interactor = new SetupTap(mongoStore, cloudStore);

    try {
      await interactor.execute(setupData);
      t.fail('should throw');
    } catch (e) {
      if (e instanceof ValidationError && e.details.field === 'kegId') {
        t.pass('should throw');
      } else {
        t.fail('should throw');
      }
    }

    t.end();
  },
);

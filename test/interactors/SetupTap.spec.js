import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import SetupTap from 'interactors/SetupTap';
import Tap from 'entities/Tap';
import Setup from 'entities/Setup';
import ValidationError from 'entities/ValidationError';
import InvalidStateError from 'entities/InvalidStateError';

const setup = new Setup(
  'a42e08c1-d278-444d-9451-72f70d916c61',
  'b60b53df-caab-41a6-9878-c00e23e504ab',
  '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
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

const tapWithoutSetup = new Tap(
  '9392780a-1d43-47a8-ab05-b425eeee96f4',
  'CESAR tap',
  true,
  undefined,
  0,
);

function createTest(tapData, clientData, beerData, kegData) {
  return around(tape)
    .before((t) => {
      const tapStore = {
        get: sinon.stub().resolves(tapData),
        update: sinon.stub().resolves(),
      };
      const clientStore = {
        exists: sinon.stub().resolves(clientData),
      };
      const beerStore = {
        exists: sinon.stub().resolves(beerData),
      };
      const kegStore = {
        exists: sinon.stub().resolves(kegData),
      };
      const setupData = {
        id: '9392780a-1d43-47a8-ab05-b425eeee96f4',
        clientId: 'a42e08c1-d278-444d-9451-72f70d916c61',
        beerId: 'b60b53df-caab-41a6-9878-c00e23e504ab',
        kegId: '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
      };

      t.next(tapStore, clientStore, beerStore, kegStore, setupData);
    });
}

createTest(tapSetupMode, true, true, true)(
  'calls update() on store',
  async (t, tapStore, clientStore, beerStore, kegStore, setupData) => {
    const interactor = new SetupTap(tapStore, clientStore, beerStore, kegStore);

    await interactor.execute(setupData);

    t.true(tapStore.update.called);
    t.end();
  },
);

createTest(tapWithoutSetup, true, true, true)(
  'updates tap if that doesn\'t have a current setup',
  async (t, tapStore, clientStore, beerStore, kegStore, setupData) => {
    const interactor = new SetupTap(tapStore, clientStore, beerStore, kegStore);

    await interactor.execute(setupData);

    t.true(tapStore.update.called);
    t.end();
  },
);

createTest(tapSetupMode, true, true, true)(
  'calls update() on store with the setup data',
  async (t, tapStore, clientStore, beerStore, kegStore, setupData) => {
    const interactor = new SetupTap(tapStore, clientStore, beerStore, kegStore);

    await interactor.execute(setupData);
    const actualTap = tapStore.update.getCall(0).args[0];

    t.deepEqual(actualTap, tapSetupMode);
    t.end();
  },
);

createTest(tapNoSetupMode, true, true, true)(
  'throws InvalidStateError if tap isn\'t in setup mode',
  async (t, tapStore, clientStore, beerStore, kegStore, setupData) => {
    const interactor = new SetupTap(tapStore, clientStore, beerStore, kegStore);

    try {
      await interactor.execute(setupData);
      t.fail('should throw');
    } catch (e) {
      if (e instanceof InvalidStateError) {
        t.pass('should throw');
      } else {
        t.fail('should throw');
      }
    }

    t.end();
  },
);

createTest(tapSetupMode, false, true, true)(
  'throws ValidationError if client entity is missing',
  async (t, tapStore, clientStore, beerStore, kegStore, setupData) => {
    const interactor = new SetupTap(tapStore, clientStore, beerStore, kegStore);

    try {
      await interactor.execute(setupData);
      t.fail('should throw');
    } catch (e) {
      if (e instanceof ValidationError && e.field === 'clientId') {
        t.pass('should throw');
      } else {
        t.fail('should throw');
      }
    }

    t.end();
  },
);

createTest(tapSetupMode, true, false, true)(
  'throws ValidationError if beer entity is missing',
  async (t, tapStore, clientStore, beerStore, kegStore, setupData) => {
    const interactor = new SetupTap(tapStore, clientStore, beerStore, kegStore);

    try {
      await interactor.execute(setupData);
      t.fail('should throw');
    } catch (e) {
      if (e instanceof ValidationError && e.field === 'beerId') {
        t.pass('should throw');
      } else {
        t.fail('should throw');
      }
    }

    t.end();
  },
);

createTest(tapSetupMode, true, true, false)(
  'throws ValidationError if keg entity is missing',
  async (t, tapStore, clientStore, beerStore, kegStore, setupData) => {
    const interactor = new SetupTap(tapStore, clientStore, beerStore, kegStore);

    try {
      await interactor.execute(setupData);
      t.fail('should throw');
    } catch (e) {
      if (e instanceof ValidationError && e.field === 'kegId') {
        t.pass('should throw');
      } else {
        t.fail('should throw');
      }
    }

    t.end();
  },
);

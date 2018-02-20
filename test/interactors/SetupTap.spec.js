import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import SetupTap from 'interactors/SetupTap';
import Tap from 'entities/Tap';
import Setup from 'entities/Setup';
import Client from 'entities/Client';
import Beer from 'entities/Beer';
import Keg from 'entities/Keg';

const setup = new Setup(
  new Client('a42e08c1-d278-444d-9451-72f70d916c61'),
  new Beer('b60b53df-caab-41a6-9878-c00e23e504ab'),
  new Keg('518b0ef3-c9ae-49d4-8955-7aed96022aaa'),
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

function createTest(data) {
  return around(tape)
    .before((t) => {
      const mongoStore = {
        setupTap: sinon.stub().resolves(),
      };
      const cloudStore = {
        setupTap: sinon.stub().resolves(),
      };
      t.next(mongoStore, cloudStore, data);
    });
}

createTest(tapSetupMode)('calls setupTap() on store', async (t, mongoStore, cloudStore, tap) => {
  const interactor = new SetupTap(mongoStore, cloudStore);

  await interactor.execute(tap);

  t.true(mongoStore.setupTap.called);
  t.end();
});

createTest(tapSetupMode)('calls setupTap() on store with the tap data', async (t, mongoStore, cloudStore, tap) => {
  const interactor = new SetupTap(mongoStore, cloudStore);

  await interactor.execute(tap);

  const actualTap = mongoStore.setupTap.getCall(0).args[0];
  t.deepEqual(actualTap, tap);
  t.end();
});

createTest(tapNoSetupMode)('throws if tap doesn\'t in setup mode', async (t, mongoStore, cloudStore, tap) => {
  const interactor = new SetupTap(mongoStore, cloudStore);

  try {
    await interactor.execute(tap);
    t.fail('should throw');
  } catch (e) {
    t.pass('should throw');
  }
  t.end();
});

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
        getTap: sinon.stub().resolves(data),
        updateTap: sinon.stub().resolves(),
      };
      const cloudStore = {
        getTap: sinon.stub().resolves(data),
        updateTap: sinon.stub().resolves(),
      };
      const setupData = {
        id: data.id,
        clientId: data.setup.client.id,
        beerId: data.setup.beer.id,
        kegId: data.setup.keg.id,
      };

      t.next(mongoStore, cloudStore, setupData);
    });
}

createTest(tapSetupMode)('calls updateTap() on store', async (t, mongoStore, cloudStore, setupData) => {
  const interactor = new SetupTap(mongoStore, cloudStore);

  await interactor.execute(setupData);

  t.true(mongoStore.updateTap.called);
  t.end();
});

createTest(tapSetupMode)('calls updateTap() on store with the setup data', async (t, mongoStore, cloudStore, setupData) => {
  const interactor = new SetupTap(mongoStore, cloudStore);

  await interactor.execute(setupData);

  const actualTap = mongoStore.updateTap.getCall(0).args[0];

  t.deepEqual(actualTap, tapSetupMode);
  t.end();
});

createTest(tapNoSetupMode)('throws if tap isn\'t in setup mode', async (t, mongoStore, cloudStore, setupData) => {
  const interactor = new SetupTap(mongoStore, cloudStore);

  try {
    await interactor.execute(setupData);
    t.fail('should throw');
  } catch (e) {
    t.pass('should throw');
  }
  t.end();
});

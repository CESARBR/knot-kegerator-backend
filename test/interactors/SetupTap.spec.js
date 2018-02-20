import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import SetupTap from 'interactors/SetupTap';
import Tap from 'entities/Tap';
import Setup from 'entities/Setup';
import Client from 'entities/Client';
import Beer from 'entities/Beer';
import Keg from 'entities/Keg';

const test = around(tape)
  .before((t) => {
    const setup = new Setup(
      new Client('a42e08c1-d278-444d-9451-72f70d916c61'),
      new Beer('b60b53df-caab-41a6-9878-c00e23e504ab'),
      new Keg('518b0ef3-c9ae-49d4-8955-7aed96022aaa'),
    );

    const tap = new Tap(
      '9392780a-1d43-47a8-ab05-b425eeee96f4',
      'CESAR tap',
      true,
      setup,
      10.5,
    );

    const mongoStore = {
      setupTap: sinon.stub().resolves(),
    };
    const cloudStore = {
      getTap: sinon.stub().resolves(tap),
      setupTap: sinon.stub().resolves(),
    };
    t.next(mongoStore, cloudStore, tap);
  });

test('calls setupTap() on store', async (t, mongoStore, cloudStore, tap) => {
  const interactor = new SetupTap(mongoStore, cloudStore);

  await interactor.execute(tap);

  t.true(mongoStore.setupTap.called);
  t.end();
});

test('calls setupTap() on store with the tap data', async (t, mongoStore, cloudStore, tap) => {
  const interactor = new SetupTap(mongoStore, cloudStore);

  await interactor.execute(tap);

  const actualTap = mongoStore.setupTap.getCall(0).args[0];
  t.deepEqual(actualTap, tap);
  t.end();
});

import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import SetupTap from 'interactors/SetupTap';
import Tap from 'entities/Tap';

const test = around(tape)
  .before((t) => {
    const tapData = new Tap(
      '9392780a-1d43-47a8-ab05-b425eeee96f4',
      'a42e08c1-d278-444d-9451-72f70d916c61',
      'b60b53df-caab-41a6-9878-c00e23e504ab',
      '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
    );

    const deviceData = {
      metadata: {
        waitingSetup: true,
        setup: {
          id: '9392780a-1d43-47a8-ab05-b425eeee96f4',
          clientId: 'a42e08c1-d278-444d-9451-72f70d916c61',
          beerId: 'b60b53df-caab-41a6-9878-c00e23e504ab',
          kegId: '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
        },
      },
    };

    const mongoStore = {
      setupTap: sinon.stub().resolves(),
    };
    const cloudStore = {
      getTap: sinon.stub().resolves(deviceData),
      setupTap: sinon.stub().resolves(),
    };
    t.next(mongoStore, cloudStore, tapData);
  });

test('calls setupTap() on store', async (t, mongoStore, cloudStore, tapData) => {
  const interactor = new SetupTap(mongoStore, cloudStore);

  await interactor.execute(tapData);

  t.true(mongoStore.setupTap.called);
  t.end();
});

test('calls setupTap() on store with the tap data', async (t, mongoStore, cloudStore, tapData) => {
  const interactor = new SetupTap(mongoStore, cloudStore);

  await interactor.execute(tapData);

  const actualTapData = mongoStore.setupTap.getCall(0).args[0];
  t.deepEqual(actualTapData, tapData);
  t.end();
});

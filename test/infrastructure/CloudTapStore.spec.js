import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import Setup from 'entities/Setup';
import Tap from 'entities/Tap';
import Client from 'entities/Client';
import Beer from 'entities/Beer';
import Keg from 'entities/Keg';
import CloudTapStore from 'infrastructure/CloudTapStore';

const test = around(tape)
  .before(async (t) => {
    const setup = new Setup(
      new Client('a42e08c1-d278-444d-9451-72f70d916c61'),
      new Beer('b60b53df-caab-41a6-9878-c00e23e504ab'),
      new Keg('518b0ef3-c9ae-49d4-8955-7aed96022aaa'),
    );
    const defaultTap = new Tap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      'CESAR tap',
      true,
      setup,
      10.5,
    );

    const cloudConnection = {
      update: sinon.stub().resolves(),
      device: sinon.stub().resolves(defaultTap),
    };

    t.next(cloudConnection);
  });

test('CloudTapStore.get() calls device method on CloudConnection', async (t, cloudConnection) => {
  const cloudTapStore = new CloudTapStore(cloudConnection);

  await cloudTapStore.get('118cc3b3-f582-4d12-9a4f-184543000000');

  t.true(cloudConnection.device.called);
  t.end();
});

test(
  'CloudTapStore.get() returns tap data returned by device method on CloudConnection',
  async (t, cloudConnection) => {
    const cloudTapStore = new CloudTapStore(cloudConnection);
    const setup = new Setup(
      new Client('a42e08c1-d278-444d-9451-72f70d916c61'),
      new Beer('b60b53df-caab-41a6-9878-c00e23e504ab'),
      new Keg('518b0ef3-c9ae-49d4-8955-7aed96022aaa'),
    );
    const expectedTap = new Tap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      'CESAR tap',
      true,
      setup,
      10.5,
    );

    const actualTap = await cloudTapStore.get('118cc3b3-f582-4d12-9a4f-184543000000');

    t.deepEqual(expectedTap, actualTap);
    t.end();
  },
);

test(
  'CloudTapStore.update() calls update method on CloudConnection',
  async (t, cloudConnection) => {
    const cloudTapStore = new CloudTapStore(cloudConnection);
    const setup = new Setup(
      new Client('a42e08c1-d278-444d-9451-72f70d916c61'),
      new Beer('b60b53df-caab-41a6-9878-c00e23e504ab'),
      new Keg('518b0ef3-c9ae-49d4-8955-7aed96022aaa'),
    );
    const tap = new Tap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      'CESAR tap',
      true,
      setup,
      10.5,
    );

    await cloudTapStore.update(tap);

    t.true(cloudConnection.update.called);
    t.end();
  },
);

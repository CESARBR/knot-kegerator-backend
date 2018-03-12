import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import Setup from 'entities/Setup';
import Tap from 'entities/Tap';
import Client from 'entities/Client';
import Beer from 'entities/Beer';
import Keg from 'entities/Keg';
import CloudTap from 'infrastructure/CloudTap';
import TapBoundStore from 'infrastructure/TapBoundStore';

const test = around(tape)
  .before(async (t) => {
    const tapFromCloud = new CloudTap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      true,
      15.0,
    );
    const setupfromDatabase = new Setup(
      new Client(
        'a42e08c1-d278-444d-9451-72f70d916c61',
        'Apolo',
      ),
      new Beer(
        'b60b53df-caab-41a6-9878-c00e23e504ab',
        'Apolo Capunga Larger',
        'Capunga',
        'Larger',
      ),
      new Keg(
        '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
        'Oak Keg',
        50.0,
        75.0,
      ),
    );
    const tapFromDatabase = new Tap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      'CESAR Tap',
      true,
      setupfromDatabase,
      45.0,
    );

    const tapStore = {
      get: sinon.stub().resolves(tapFromDatabase),
      update: sinon.stub().resolves(),
    };
    const cloudTapStore = {
      get: sinon.stub().resolves(tapFromCloud),
      update: sinon.stub().resolves(),
    };

    t.next(tapStore, cloudTapStore);
  });

test('TapBoundStore.get() calls get method on tapStore', async (t, tapStore, cloudTapStore) => {
  const tapBoundStore = new TapBoundStore(tapStore, cloudTapStore);

  await tapBoundStore.get('118cc3b3-f582-4d12-9a4f-184543000000');

  t.true(tapStore.get.called);
  t.end();
});

test(
  'TapBoundStore.get() calls get method on cloudTapStore',
  async (t, tapStore, cloudTapStore) => {
    const tapBoundStore = new TapBoundStore(tapStore, cloudTapStore);

    await tapBoundStore.get('118cc3b3-f582-4d12-9a4f-184543000000');

    t.true(cloudTapStore.get.called);
    t.end();
  },
);

test(
  'TapBoundStore.get() returns the Tap object merged from tapStore and cloudTapStore',
  async (t, tapStore, cloudTapStore) => {
    const tapBoundStore = new TapBoundStore(tapStore, cloudTapStore);

    const expectedSetup = new Setup(
      new Client(
        'a42e08c1-d278-444d-9451-72f70d916c61',
        'Apolo',
      ),
      new Beer(
        'b60b53df-caab-41a6-9878-c00e23e504ab',
        'Apolo Capunga Larger',
        'Capunga',
        'Larger',
      ),
      new Keg(
        '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
        'Oak Keg',
        50.0,
        75.0,
      ),
    );
    const expectedTap = new Tap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      'CESAR Tap',
      true,
      expectedSetup,
      15.0,
    );

    const actualTap = await tapBoundStore.get('118cc3b3-f582-4d12-9a4f-184543000000');

    t.deepEqual(actualTap, expectedTap);
    t.end();
  },
);

test(
  'TapBoundStore.update() calls update method on tapStore',
  async (t, tapStore, cloudTapStore) => {
    const tapBoundStore = new TapBoundStore(tapStore, cloudTapStore);

    const setup = new Setup(
      new Client(
        'a42e08c1-d278-444d-9451-72f70d916c61',
        'Apolo',
      ),
      new Beer(
        'b60b53df-caab-41a6-9878-c00e23e504ab',
        'Apolo Capunga Larger',
        'Capunga',
        'Larger',
      ),
      new Keg(
        '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
        'Oak Keg',
        50.0,
        75.0,
      ),
    );
    const tap = new Tap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      'CESAR Tap',
      true,
      setup,
      45.0,
    );

    await tapBoundStore.update(tap);

    t.true(tapStore.update.called);
    t.end();
  },
);

test(
  'TapBoundStore.update() calls update method on cloudTapStore',
  async (t, tapStore, cloudTapStore) => {
    const tapBoundStore = new TapBoundStore(tapStore, cloudTapStore);

    const setup = new Setup(
      new Client(
        'a42e08c1-d278-444d-9451-72f70d916c61',
        'Apolo',
      ),
      new Beer(
        'b60b53df-caab-41a6-9878-c00e23e504ab',
        'Apolo Capunga Larger',
        'Capunga',
        'Larger',
      ),
      new Keg(
        '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
        'Oak Keg',
        50.0,
        75.0,
      ),
    );
    const tap = new Tap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      'CESAR Tap',
      true,
      setup,
      45.0,
    );

    await tapBoundStore.update(tap);

    t.true(cloudTapStore.update.called);
    t.end();
  },
);

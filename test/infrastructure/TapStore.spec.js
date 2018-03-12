import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import Setup from 'entities/Setup';
import Tap from 'entities/Tap';
import Beer from 'entities/Beer';
import Keg from 'entities/Keg';
import CloudTap from 'infrastructure/CloudTap';
import TapStore from 'infrastructure/TapStore';

const test = around(tape)
  .before(async (t) => {
    const tapFromCloud = new CloudTap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      true,
      15.0,
    );
    const tapFromDatabase = new Tap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      'CESAR Tap',
      undefined,
      new Setup(
        'a42e08c1-d278-444d-9451-72f70d916c61',
        'b60b53df-caab-41a6-9878-c00e23e504ab',
        '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
      ),
    );
    const beerFromDatabase = new Beer(
      '1fb78cbb-5fc1-46fd-80e5-cf541b905324',
      'Capunga American Pale Ale',
      'Capunga',
      'American Pale Ale',
    );
    const kegFromDatabase = new Keg(
      'd6600558-f101-45be-bf8a-4b5aed40cf9f',
      'Stainless steel',
      10,
      70.5,
    );

    const databaseTapStore = {
      get: sinon.stub().resolves(tapFromDatabase),
      update: sinon.stub().resolves(),
    };
    const cloudTapStore = {
      get: sinon.stub().resolves(tapFromCloud),
      update: sinon.stub().resolves(),
    };
    const beerStore = {
      get: sinon.stub().resolves(beerFromDatabase),
    };
    const kegStore = {
      get: sinon.stub().resolves(kegFromDatabase),
    };


    t.next(databaseTapStore, cloudTapStore, beerStore, kegStore);
  });

test(
  'TapStore.get() calls get method on databaseTapStore',
  async (t, databaseTapStore, cloudTapStore, beerStore, kegStore) => {
    const tapStore = new TapStore(
      databaseTapStore,
      cloudTapStore,
      beerStore,
      kegStore,
    );

    await tapStore.get('118cc3b3-f582-4d12-9a4f-184543000000');

    t.true(databaseTapStore.get.called);
    t.end();
  },
);

test(
  'TapStore.get() calls get method on cloudTapStore',
  async (t, databaseTapStore, cloudTapStore, beerStore, kegStore) => {
    const tapStore = new TapStore(
      databaseTapStore,
      cloudTapStore,
      beerStore,
      kegStore,
    );

    await tapStore.get('118cc3b3-f582-4d12-9a4f-184543000000');

    t.true(cloudTapStore.get.called);
    t.end();
  },
);

test(
  'TapStore.get() returns the Tap object merged from databaseTapStore and cloudTapStore',
  async (t, databaseTapStore, cloudTapStore, beerStore, kegStore) => {
    const tapStore = new TapStore(
      databaseTapStore,
      cloudTapStore,
      beerStore,
      kegStore,
    );

    const expectedTap = new Tap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      'CESAR Tap',
      true,
      new Setup(
        'a42e08c1-d278-444d-9451-72f70d916c61',
        'b60b53df-caab-41a6-9878-c00e23e504ab',
        '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
      ),
      15.0,
    );

    const actualTap = await tapStore.get('118cc3b3-f582-4d12-9a4f-184543000000');

    t.deepEqual(actualTap, expectedTap);
    t.end();
  },
);

test(
  'TapStore.update() calls update method on databaseTapStore',
  async (t, databaseTapStore, cloudTapStore, beerStore, kegStore) => {
    const tapStore = new TapStore(
      databaseTapStore,
      cloudTapStore,
      beerStore,
      kegStore,
    );

    const tap = new Tap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      'CESAR Tap',
      true,
      new Setup(
        'a42e08c1-d278-444d-9451-72f70d916c61',
        'b60b53df-caab-41a6-9878-c00e23e504ab',
        '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
      ),
      15.0,
    );

    await tapStore.update(tap);

    t.true(databaseTapStore.update.called);
    t.end();
  },
);

test(
  'TapStore.update() calls get method on beerStore',
  async (t, databaseTapStore, cloudTapStore, beerStore, kegStore) => {
    const tapStore = new TapStore(
      databaseTapStore,
      cloudTapStore,
      beerStore,
      kegStore,
    );

    const tap = new Tap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      'CESAR Tap',
      true,
      new Setup(
        'a42e08c1-d278-444d-9451-72f70d916c61',
        'b60b53df-caab-41a6-9878-c00e23e504ab',
        '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
      ),
      15.0,
    );

    await tapStore.update(tap);

    t.true(beerStore.get.called);
    t.end();
  },
);

test(
  'TapStore.update() calls get method on kegStore',
  async (t, databaseTapStore, cloudTapStore, beerStore, kegStore) => {
    const tapStore = new TapStore(
      databaseTapStore,
      cloudTapStore,
      beerStore,
      kegStore,
    );

    const tap = new Tap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      'CESAR Tap',
      true,
      new Setup(
        'a42e08c1-d278-444d-9451-72f70d916c61',
        'b60b53df-caab-41a6-9878-c00e23e504ab',
        '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
      ),
      15.0,
    );

    await tapStore.update(tap);

    t.true(kegStore.get.called);
    t.end();
  },
);

test(
  'TapStore.update() calls update method on cloudTapStore',
  async (t, databaseTapStore, cloudTapStore, beerStore, kegStore) => {
    const tapStore = new TapStore(
      databaseTapStore,
      cloudTapStore,
      beerStore,
      kegStore,
    );

    const tap = new Tap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      'CESAR Tap',
      true,
      new Setup(
        'a42e08c1-d278-444d-9451-72f70d916c61',
        'b60b53df-caab-41a6-9878-c00e23e504ab',
        '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
      ),
      15.0,
    );

    await tapStore.update(tap);

    t.true(cloudTapStore.update.called);
    t.end();
  },
);

import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import Setup from 'entities/Setup';
import Tap from 'entities/Tap';
import Client from 'entities/Client';
import Beer from 'entities/Beer';
import Keg from 'entities/Keg';
import CloudTap from 'infrastructure/CloudTap';
import DatabaseTap from 'infrastructure/DatabaseTap';
import TapStore from 'infrastructure/TapStore';

const test = around(tape)
  .before(async (t) => {
    const tapsFromCloud = [
      {
        id: '7bfe7203-2617-4590-bfac-8d48923fbf01',
        waitingSetup: false,
        volume: 50,
      },
      {
        id: 'da412ca4-e2c4-4475-8461-abfffabde9e5',
        waitingSetup: true,
        volume: 0,
      },
    ];
    const tapsFromDatabase = [
      {
        id: '7bfe7203-2617-4590-bfac-8d48923fbf01',
        name: 'Office tap',
        setup: {
          clientId: '325163c5-7f5d-46a7-beb6-45e94cb73f0f',
          beerId: 'b60b53df-caab-41a6-9878-c00e23e504ab',
          kegId: '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
        },
      },
      {
        id: 'da412ca4-e2c4-4475-8461-abfffabde9e5',
        name: 'Market tap',
      },
    ];

    const tapFromCloud = new CloudTap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      true,
      15.0,
    );
    const tapFromDatabase = new DatabaseTap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      'CESAR tap',
      {
        clientId: 'a42e08c1-d278-444d-9451-72f70d916c61',
        beerId: '1fb78cbb-5fc1-46fd-80e5-cf541b905324',
        kegId: 'd6600558-f101-45be-bf8a-4b5aed40cf9f',
      },
    );

    const clientFromDatabase = new Client(
      '325163c5-7f5d-46a7-beb6-45e94cb73f0f',
      'CESAR',
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
      list: sinon.stub().resolves(tapsFromDatabase),
      update: sinon.stub().resolves(),
    };
    const cloudTapStore = {
      get: sinon.stub().resolves(tapFromCloud),
      list: sinon.stub().resolves(tapsFromCloud),
      update: sinon.stub().resolves(),
    };
    const clientStore = {
      get: sinon.stub().resolves(clientFromDatabase),
    };
    const beerStore = {
      get: sinon.stub().resolves(beerFromDatabase),
    };
    const kegStore = {
      get: sinon.stub().resolves(kegFromDatabase),
    };


    t.next(databaseTapStore, cloudTapStore, clientStore, beerStore, kegStore);
  });

test(
  'TapStore.get() calls get method on databaseTapStore',
  async (t, databaseTapStore, cloudTapStore, clientStore, beerStore, kegStore) => {
    const tapStore = new TapStore(
      databaseTapStore,
      cloudTapStore,
      clientStore,
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
  async (t, databaseTapStore, cloudTapStore, clientStore, beerStore, kegStore) => {
    const tapStore = new TapStore(
      databaseTapStore,
      cloudTapStore,
      clientStore,
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
  async (t, databaseTapStore, cloudTapStore, clientStore, beerStore, kegStore) => {
    const tapStore = new TapStore(
      databaseTapStore,
      cloudTapStore,
      clientStore,
      beerStore,
      kegStore,
    );

    const expectedTap = new Tap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      'CESAR tap',
      true,
      new Setup(
        'a42e08c1-d278-444d-9451-72f70d916c61',
        '1fb78cbb-5fc1-46fd-80e5-cf541b905324',
        'd6600558-f101-45be-bf8a-4b5aed40cf9f',
      ),
      15.0,
    );

    const actualTap = await tapStore.get('118cc3b3-f582-4d12-9a4f-184543000000');

    t.deepEqual(actualTap, expectedTap);
    t.end();
  },
);

test(
  'TapStore.list() calls list method on databaseTapStore',
  async (t, databaseTapStore, cloudTapStore, clientStore, beerStore, kegStore) => {
    const tapStore = new TapStore(
      databaseTapStore,
      cloudTapStore,
      clientStore,
      beerStore,
      kegStore,
    );

    await tapStore.list();

    t.true(databaseTapStore.list.called);
    t.end();
  },
);

test(
  'TapStore.list() calls list method on cloudTapStore',
  async (t, databaseTapStore, cloudTapStore, clientStore, beerStore, kegStore) => {
    const tapStore = new TapStore(
      databaseTapStore,
      cloudTapStore,
      clientStore,
      beerStore,
      kegStore,
    );

    await tapStore.list();

    t.true(cloudTapStore.list.called);
    t.end();
  },
);

test(
  'TapStore.list() returns Taps from tapStore and cloudTapStore',
  async (t, databaseTapStore, cloudTapStore, clientStore, beerStore, kegStore) => {
    const tapStore = new TapStore(
      databaseTapStore,
      cloudTapStore,
      clientStore,
      beerStore,
      kegStore,
    );

    const expectedTaps = [
      {
        id: '7bfe7203-2617-4590-bfac-8d48923fbf01',
        name: 'Office tap',
        waitingSetup: false,
        setup: {
          clientId: '325163c5-7f5d-46a7-beb6-45e94cb73f0f',
          beerId: 'b60b53df-caab-41a6-9878-c00e23e504ab',
          kegId: '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
        },
        volume: 50,
      },
      {
        id: 'da412ca4-e2c4-4475-8461-abfffabde9e5',
        name: 'Market tap',
        waitingSetup: true,
      },
    ];

    const actualTaps = await tapStore.list();

    t.deepEqual(actualTaps, expectedTaps);
    t.end();
  },
);

test(
  'TapStore.update() calls update method on databaseTapStore',
  async (t, databaseTapStore, cloudTapStore, clientStore, beerStore, kegStore) => {
    const tapStore = new TapStore(
      databaseTapStore,
      cloudTapStore,
      clientStore,
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
  'TapStore.update() calls update method on cloudTapStore',
  async (t, databaseTapStore, cloudTapStore, clientStore, beerStore, kegStore) => {
    const tapStore = new TapStore(
      databaseTapStore,
      cloudTapStore,
      clientStore,
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

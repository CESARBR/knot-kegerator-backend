import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import Setup from 'entities/Setup';
import Tap from 'entities/Tap';
import Client from 'entities/Client';
import Beer from 'entities/Beer';
import Keg from 'entities/Keg';
import TapStore from 'infrastructure/TapStore';
import EntityNotFoundError from 'entities/EntityNotFoundError';

const setup = new Setup(
  new Client('a42e08c1-d278-444d-9451-72f70d916c61'),
  new Beer('b60b53df-caab-41a6-9878-c00e23e504ab'),
  new Keg('518b0ef3-c9ae-49d4-8955-7aed96022aaa'),
);
const defaultTap = new Tap(
  '118cc3b3-f582-4d12-9a4f-184543000000',
  'CESAR tap',
  setup,
);

const tapsData = [
  {
    id: '7bfe7203-2617-4590-bfac-8d48923fbf01',
    name: 'Office tap',
    setup: {
      client: {
        id: '325163c5-7f5d-46a7-beb6-45e94cb73f0f',
        name: 'CESAR',
      },
      beer: {
        id: '1fb78cbb-5fc1-46fd-80e5-cf541b905324',
        name: 'Capunga American Pale Ale',
        brand: 'Capunga',
        style: 'American Pale Ale',
      },
      keg: {
        id: 'd6600558-f101-45be-bf8a-4b5aed40cf9f',
        name: 'Stainless steel',
        weight: 10,
        totalVolume: 50,
      },
    },
  },
  {
    id: 'da412ca4-e2c4-4475-8461-abfffabde9e5',
    name: 'Market tap',
  },
];

function createTest(findData, updateData) {
  return around(tape)
    .before(async (t) => {
      const mongoConnection = {
        find: sinon.stub().resolves(findData),
        findOne: sinon.stub().resolves(findData),
        findOneAndUpdate: sinon.stub().resolves(updateData),
      };

      t.next(mongoConnection);
    });
}

createTest(defaultTap, null)(
  'TapStore.get() calls findOne method on MongoConnection',
  async (t, mongoConnection) => {
    const tapStore = new TapStore(mongoConnection);

    await tapStore.get('118cc3b3-f582-4d12-9a4f-184543000000');

    t.true(mongoConnection.findOne.called);
    t.end();
  },
);

createTest(defaultTap, null)(
  'TapStore.get() returns tap data returned by calling MongoConnection.findOne()',
  async (t, mongoConnection) => {
    const tapStore = new TapStore(mongoConnection);
    const expectedTap = defaultTap;

    const actualTap = await tapStore.get('118cc3b3-f582-4d12-9a4f-184543000000');

    t.deepEqual(expectedTap, actualTap);
    t.end();
  },
);

createTest(null, null)(
  'TapStore.get() throws EntityNotFoundError if tap entity isn\'t found',
  async (t, mongoConnection) => {
    const tapStore = new TapStore(mongoConnection);

    try {
      await tapStore.get('01036e39-1d01-4e4e-b8e2-d5274f12f705');
      t.fail('should throw');
    } catch (e) {
      if (e instanceof EntityNotFoundError
        && e.entity === 'Tap'
        && e.id === '01036e39-1d01-4e4e-b8e2-d5274f12f705'
      ) {
        t.pass('should throw');
      } else {
        t.fail('should throw');
      }
    }

    t.end();
  },
);

createTest(tapsData, null)(
  'TapStore.getAll() calls find method on MongoConnection',
  async (t, mongoConnection) => {
    const tapStore = new TapStore(mongoConnection);

    await tapStore.getAll();

    t.true(mongoConnection.find.called);
    t.end();
  },
);

createTest(tapsData, null)(
  'TapStore.getAll() returns tap data returned by calling MongoConnection.find()',
  async (t, mongoConnection) => {
    const tapStore = new TapStore(mongoConnection);
    const expectedTaps = tapsData;

    const actualTaps = await tapStore.getAll();

    t.deepEqual(expectedTaps, actualTaps);
    t.end();
  },
);


createTest(null, defaultTap)(
  'TapStore.update() calls findOneAndUpdate method on MongoConnection',
  async (t, mongoConnection) => {
    const tapStore = new TapStore(mongoConnection);
    const tap = defaultTap;

    await tapStore.update(tap);

    t.true(mongoConnection.findOneAndUpdate.called);
    t.end();
  },
);

createTest(null, defaultTap)(
  'TapStore.update() returns tap data updated by calling MongoConnection.findOneAndUpdate()',
  async (t, mongoConnection) => {
    const tapStore = new TapStore(mongoConnection);
    const expectedSetup = new Setup(
      new Client('883c84fc-ed34-412d-b1f5-8df7d08db888'),
      new Beer('2798f894-6642-4481-a531-482ed077aff3'),
      new Keg('f01f6ab8-1468-457b-ab48-136469961669'),
    );
    const expectedTap = new Tap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      'KNoT tap',
      undefined,
      expectedSetup,
      undefined,
    );

    await tapStore.update(expectedTap);

    const actualTap = mongoConnection.findOneAndUpdate.getCall(0).args[0];

    t.true(expectedTap, actualTap);
    t.end();
  },
);

createTest(null, null)(
  'TapStore.update() throws EntityNotFoundError if tap entity isn\'t found',
  async (t, mongoConnection) => {
    const tapStore = new TapStore(mongoConnection);
    const expectedSetup = new Setup(
      new Client('883c84fc-ed34-412d-b1f5-8df7d08db888'),
      new Beer('2798f894-6642-4481-a531-482ed077aff3'),
      new Keg('f01f6ab8-1468-457b-ab48-136469961669'),
    );
    const tap = new Tap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      'KNoT tap',
      undefined,
      expectedSetup,
      undefined,
    );

    try {
      await tapStore.update(tap);
      t.fail('should throw');
    } catch (e) {
      if (e instanceof EntityNotFoundError
        && e.entity === 'Tap'
        && e.id === '118cc3b3-f582-4d12-9a4f-184543000000'
      ) {
        t.pass('should throw');
      } else {
        t.fail('should throw');
      }
    }

    t.end();
  },
);

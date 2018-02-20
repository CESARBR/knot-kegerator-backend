import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import Setup from 'entities/Setup';
import Tap from 'entities/Tap';
import Client from 'entities/Client';
import Beer from 'entities/Beer';
import Keg from 'entities/Keg';
import DatabaseTapStore from 'infrastructure/DatabaseTapStore';
import EntityNotFoundError from 'entities/EntityNotFoundError';

const setup = new Setup(
  new Client('a42e08c1-d278-444d-9451-72f70d916c61'),
  new Beer('b60b53df-caab-41a6-9878-c00e23e504ab'),
  new Keg('518b0ef3-c9ae-49d4-8955-7aed96022aaa'),
);
const defaultTap = new Tap(
  '118cc3b3-f582-4d12-9a4f-184543000000',
  'CESAR tap',
  undefined,
  setup,
  undefined,
);

function createTest(findData, updateData) {
  return around(tape)
    .before(async (t) => {
      const mongoConnection = {
        findOne: sinon.stub().resolves(findData),
        findOneAndUpdate: sinon.stub().resolves(updateData),
      };

      t.next(mongoConnection);
    });
}

createTest(defaultTap, null)(
  'DatabaseTapStore.get() calls findOne method on MongoConnection',
  async (t, mongoConnection) => {
    const databaseTapStore = new DatabaseTapStore(mongoConnection);

    await databaseTapStore.get('118cc3b3-f582-4d12-9a4f-184543000000');

    t.true(mongoConnection.findOne.called);
    t.end();
  },
);

createTest(defaultTap, null)(
  'DatabaseTapStore.get() returns tap data returned by calling MongoConnection.findOne()',
  async (t, mongoConnection) => {
    const databaseTapStore = new DatabaseTapStore(mongoConnection);
    const expectedTap = defaultTap;

    const actualTap = await databaseTapStore.get('118cc3b3-f582-4d12-9a4f-184543000000');

    t.deepEqual(expectedTap, actualTap);
    t.end();
  },
);

createTest(null, null)(
  'DatabaseTapStore.get() throws EntityNotFoundError if tap entity isn\'t found',
  async (t, mongoConnection) => {
    const databaseTapStore = new DatabaseTapStore(mongoConnection);

    try {
      await databaseTapStore.get('01036e39-1d01-4e4e-b8e2-d5274f12f705');
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

createTest(null, defaultTap)(
  'DatabaseTapStore.update() calls findOneAndUpdate method on MongoConnection',
  async (t, mongoConnection) => {
    const databaseTapStore = new DatabaseTapStore(mongoConnection);
    const tap = defaultTap;

    await databaseTapStore.update(tap);

    t.true(mongoConnection.findOneAndUpdate.called);
    t.end();
  },
);

createTest(null, defaultTap)(
  'DatabaseTapStore.update() returns tap data updated by calling MongoConnection.findOneAndUpdate()',
  async (t, mongoConnection) => {
    const databaseTapStore = new DatabaseTapStore(mongoConnection);
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

    await databaseTapStore.update(expectedTap);

    const actualTap = mongoConnection.findOneAndUpdate.getCall(0).args[0];

    t.true(expectedTap, actualTap);
    t.end();
  },
);

createTest(null, null)(
  'DatabaseTapStore.update() throws EntityNotFoundError if tap entity isn\'t found',
  async (t, mongoConnection) => {
    const databaseTapStore = new DatabaseTapStore(mongoConnection);
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
      await databaseTapStore.update(tap);
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

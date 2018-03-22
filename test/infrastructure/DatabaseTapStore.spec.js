import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import Setup from 'entities/Setup';
import DatabaseTap from 'infrastructure/DatabaseTap';
import DatabaseTapStore from 'infrastructure/DatabaseTapStore';
import EntityNotFoundError from 'entities/EntityNotFoundError';

const databaseTap = new DatabaseTap(
  '118cc3b3-f582-4d12-9a4f-184543000000',
  'CESAR tap',
  new Setup(
    'a42e08c1-d278-444d-9451-72f70d916c61',
    'b60b53df-caab-41a6-9878-c00e23e504ab',
    '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
  ),
);

function createTest(findData, updateData) {
  return around(tape)
    .before(async (t) => {
      const mongoConnection = {
        findOne: sinon.stub().resolves(findData),
        find: sinon.stub().resolves(findData),
        findOneAndUpdate: sinon.stub().resolves(updateData),
      };

      t.next(mongoConnection);
    });
}

createTest(databaseTap, null)(
  'DatabaseTapStore.get() calls findOne method on MongoConnection',
  async (t, mongoConnection) => {
    const databaseTapStore = new DatabaseTapStore(mongoConnection);

    await databaseTapStore.get('118cc3b3-f582-4d12-9a4f-184543000000');

    t.true(mongoConnection.findOne.called);
    t.end();
  },
);

createTest(databaseTap, null)(
  'DatabaseTapStore.get() returns Tap data from MongoConnection.findOne()',
  async (t, mongoConnection) => {
    const databaseTapStore = new DatabaseTapStore(mongoConnection);
    const expectedTap = databaseTap;

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

createTest(null, databaseTap)(
  'DatabaseTapStore.update() calls findOneAndUpdate method on MongoConnection',
  async (t, mongoConnection) => {
    const databaseTapStore = new DatabaseTapStore(mongoConnection);
    const tap = databaseTap;

    await databaseTapStore.update(tap);

    t.true(mongoConnection.findOneAndUpdate.called);
    t.end();
  },
);

createTest(null, databaseTap)(
  'DatabaseTapStore.update() returns updated Tap data from MongoConnection.findOneAndUpdate()',
  async (t, mongoConnection) => {
    const databaseTapStore = new DatabaseTapStore(mongoConnection);

    const expectedTap = new DatabaseTap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      'KNoT tap',
      new Setup(
        '883c84fc-ed34-412d-b1f5-8df7d08db888',
        '2798f894-6642-4481-a531-482ed077aff3',
        'f01f6ab8-1468-457b-ab48-136469961669',
      ),
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

    const tap = new DatabaseTap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      'KNoT tap',
      new Setup(
        '883c84fc-ed34-412d-b1f5-8df7d08db888',
        '2798f894-6642-4481-a531-482ed077aff3',
        'f01f6ab8-1468-457b-ab48-136469961669',
      ),
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

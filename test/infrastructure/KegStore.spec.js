import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import KegStore from 'infrastructure/KegStore';

function createTest(countData) {
  return around(tape)
    .before(async (t) => {
      const kegData = {
        id: 'd73100cc-a2c7-41e7-9736-7366c2ce9c57',
        name: 'Stainless steel',
        weight: 10,
        totalVolume: 50,
      };

      const mongoConnection = {
        count: sinon.stub().resolves(countData),
        findOne: sinon.stub().resolves(kegData),
      };

      t.next(mongoConnection);
    });
}

createTest(0)(
  'KegStore.exists() calls count method on MongoConnection',
  async (t, mongoConnection) => {
    const kegStore = new KegStore(mongoConnection);

    await kegStore.exists('d73100cc-a2c7-41e7-9736-7366c2ce9c57');

    t.true(mongoConnection.count.called);
    t.end();
  },
);

createTest(1)(
  'KegStore.exists() returns true if MongoConnection.count() is greater than 0',
  async (t, mongoConnection) => {
    const kegStore = new KegStore(mongoConnection);

    const expectedData = true;

    const actualData = await kegStore.exists('d73100cc-a2c7-41e7-9736-7366c2ce9c57');

    t.deepEqual(expectedData, actualData);
    t.end();
  },
);

createTest(0)(
  'KegStore.exists() returns false if MongoConnection.count() is equal to 0',
  async (t, mongoConnection) => {
    const kegStore = new KegStore(mongoConnection);

    const expectedData = false;

    const actualData = await kegStore.exists('d73100cc-a2c7-41e7-9736-7366c2ce9c57');

    t.deepEqual(expectedData, actualData);
    t.end();
  },
);

createTest(1)(
  'KegStore.get() calls findOne method on MongoConnection',
  async (t, mongoConnection) => {
    const kegStore = new KegStore(mongoConnection);

    await kegStore.get('d73100cc-a2c7-41e7-9736-7366c2ce9c57');

    t.true(mongoConnection.findOne.called);
    t.end();
  },
);

createTest(0)(
  'KegStore.get() returns Keg data from MongoConnection.findOne()',
  async (t, mongoConnection) => {
    const kegStore = new KegStore(mongoConnection);

    const expectedData = {
      id: 'd73100cc-a2c7-41e7-9736-7366c2ce9c57',
      name: 'Stainless steel',
      weight: 10,
      totalVolume: 50,
    };

    const actualData = await kegStore.get('d73100cc-a2c7-41e7-9736-7366c2ce9c57');

    t.deepEqual(expectedData, actualData);
    t.end();
  },
);

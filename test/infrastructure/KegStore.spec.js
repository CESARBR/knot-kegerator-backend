import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import KegStore from 'infrastructure/KegStore';

function createTest(countData) {
  return around(tape)
    .before(async (t) => {
      const mongoConnection = {
        count: sinon.stub().resolves(countData),
      };

      t.next(mongoConnection);
    });
}

createTest(null)(
  'KegStore.exists() calls count method on MongoConnection',
  async (t, mongoConnection) => {
    const kegStore = new KegStore(mongoConnection);

    await kegStore.exists('d73100cc-a2c7-41e7-9736-7366c2ce9c57');

    t.true(mongoConnection.count.called);
    t.end();
  },
);

createTest(1)(
  'KegStore.exists() returns true if MongoConnection.count() find the keg',
  async (t, mongoConnection) => {
    const kegStore = new KegStore(mongoConnection);

    const expectedData = true;

    const actualData = await kegStore.exists('d73100cc-a2c7-41e7-9736-7366c2ce9c57');

    t.deepEqual(expectedData, actualData);
    t.end();
  },
);

createTest(0)(
  'KegStore.exists() returns false if MongoConnection.count() didn\'t find the keg',
  async (t, mongoConnection) => {
    const kegStore = new KegStore(mongoConnection);

    const expectedData = false;

    const actualData = await kegStore.exists('d73100cc-a2c7-41e7-9736-7366c2ce9c57');

    t.deepEqual(expectedData, actualData);
    t.end();
  },
);

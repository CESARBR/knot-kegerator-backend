import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import ClientStore from 'infrastructure/ClientStore';

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
  'ClientStore.exists() calls count method on MongoConnection',
  async (t, mongoConnection) => {
    const clientStore = new ClientStore(mongoConnection);

    await clientStore.exists('118cc3b3-f582-4d12-9a4f-184543000000');

    t.true(mongoConnection.count.called);
    t.end();
  },
);

createTest(1)(
  'ClientStore.exists() returns true if MongoConnection.count() find the client',
  async (t, mongoConnection) => {
    const clientStore = new ClientStore(mongoConnection);

    const expectedData = true;

    const actualData = await clientStore.exists('118cc3b3-f582-4d12-9a4f-184543000000');

    t.deepEqual(expectedData, actualData);
    t.end();
  },
);

createTest(0)(
  'ClientStore.exists() returns false if MongoConnection.count() didn\'t find the client',
  async (t, mongoConnection) => {
    const clientStore = new ClientStore(mongoConnection);

    const expectedData = false;

    const actualData = await clientStore.exists('118cc3b3-f582-4d12-9a4f-184543000000');

    t.deepEqual(expectedData, actualData);
    t.end();
  },
);

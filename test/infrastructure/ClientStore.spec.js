import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import ClientStore from 'infrastructure/ClientStore';

const clientsData = [
  {
    id: '325163c5-7f5d-46a7-beb6-45e94cb73f0f',
    name: 'CESAR',
  },
  {
    id: '3dd28356-a2bd-4a2b-ba26-22acfd2069c9',
    name: 'Impact Hub',
  },
];

function createTest(countData, findData) {
  return around(tape)
    .before(async (t) => {
      const mongoConnection = {
        count: sinon.stub().resolves(countData),
        find: sinon.stub().resolves(findData),
      };

      t.next(mongoConnection);
    });
}
createTest(null, null)(
  'ClientStore.getAll() calls find method on MongoConnection',
  async (t, mongoConnection) => {
    const clientStore = new ClientStore(mongoConnection);

    await clientStore.getAll();

    t.true(mongoConnection.find.called);
    t.end();
  },
);

createTest(1, clientsData)(
  'ClientStore.getAll() returns a list of clients from MongoConnection.find()',
  async (t, mongoConnection) => {
    const clientStore = new ClientStore(mongoConnection);
    const expectedClients = [
      {
        id: '325163c5-7f5d-46a7-beb6-45e94cb73f0f',
        name: 'CESAR',
      },
      {
        id: '3dd28356-a2bd-4a2b-ba26-22acfd2069c9',
        name: 'Impact Hub',
      },
    ];

    const actualClients = await clientStore.getAll();

    t.deepEqual(actualClients, expectedClients);
    t.end();
  },
);

createTest(1, [])(
  'ClientStore.getAll() returns a empty list if no client if found from MongoConnection.find()',
  async (t, mongoConnection) => {
    const clientStore = new ClientStore(mongoConnection);
    const expectedList = [];

    const actualList = await clientStore.getAll();

    t.deepEqual(actualList, expectedList);
    t.end();
  },
);
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

import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import KegStore from 'infrastructure/KegStore';

const kegsData = [
  {
    id: 'd6600558-f101-45be-bf8a-4b5aed40cf9f',
    name: 'Stainless steel',
    weight: 10,
    totalVolume: 70.5,
  },
  {
    id: '58a6168c-5676-41a0-8beb-b983764eb797',
    name: 'Rubber',
    weight: 5,
    totalVolume: 70.5,
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
  'KegStore.getAll() calls find method on MongoConnection',
  async (t, mongoConnection) => {
    const kegStore = new KegStore(mongoConnection);

    await kegStore.getAll();

    t.true(mongoConnection.find.called);
    t.end();
  },
);

createTest(1, kegsData)(
  'KegStore.getAll() returns a list of kegs from MongoConnection.find()',
  async (t, mongoConnection) => {
    const kegStore = new KegStore(mongoConnection);
    const expectedKegs = [
      {
        id: 'd6600558-f101-45be-bf8a-4b5aed40cf9f',
        name: 'Stainless steel',
        weight: 10,
        totalVolume: 70.5,
      },
      {
        id: '58a6168c-5676-41a0-8beb-b983764eb797',
        name: 'Rubber',
        weight: 5,
        totalVolume: 70.5,
      },
    ];

    const actualKegs = await kegStore.getAll();

    t.deepEqual(actualKegs, expectedKegs);
    t.end();
  },
);

createTest(1, [])(
  'KegStore.getAll() returns a empty list if no keg if found from MongoConnection.find()',
  async (t, mongoConnection) => {
    const kegStore = new KegStore(mongoConnection);
    const expectedList = [];

    const actualList = await kegStore.getAll();

    t.deepEqual(actualList, expectedList);
    t.end();
  },
);

createTest(null, null)(
  'KegStore.exists() calls count method on MongoConnection',
  async (t, mongoConnection) => {
    const kegStore = new KegStore(mongoConnection);

    await kegStore.exists('d73100cc-a2c7-41e7-9736-7366c2ce9c57');

    t.true(mongoConnection.count.called);
    t.end();
  },
);

createTest(1, null)(
  'KegStore.exists() returns true if MongoConnection.count() find the keg',
  async (t, mongoConnection) => {
    const kegStore = new KegStore(mongoConnection);

    const expectedData = true;

    const actualData = await kegStore.exists('d73100cc-a2c7-41e7-9736-7366c2ce9c57');

    t.deepEqual(expectedData, actualData);
    t.end();
  },
);

createTest(0, null)(
  'KegStore.exists() returns false if MongoConnection.count() didn\'t find the keg',
  async (t, mongoConnection) => {
    const kegStore = new KegStore(mongoConnection);

    const expectedData = false;

    const actualData = await kegStore.exists('d73100cc-a2c7-41e7-9736-7366c2ce9c57');

    t.deepEqual(expectedData, actualData);
    t.end();
  },
);

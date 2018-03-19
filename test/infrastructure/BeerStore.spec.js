import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import BeerStore from 'infrastructure/BeerStore';

const beersData = [
  {
    id: '1fb78cbb-5fc1-46fd-80e5-cf541b905324',
    name: 'Capunga American Pale Ale',
    brand: 'Capunga',
    style: 'American Pale Ale',
  },
  {
    id: 'ce47b845-80bf-4f1f-b939-0fe5bc271024',
    name: 'Capunga American Lager',
    brand: 'Capunga',
    style: 'American Premium Lager',
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

createTest(0, null)(
  'BeerStore.list() calls find method on MongoConnection',
  async (t, mongoConnection) => {
    const beerStore = new BeerStore(mongoConnection);

    await beerStore.list();

    t.true(mongoConnection.find.called);
    t.end();
  },
);

createTest(1, beersData)(
  'BeerStore.list() returns a list of beers from MongoConnection.find()',
  async (t, mongoConnection) => {
    const beerStore = new BeerStore(mongoConnection);
    const expectedBeers = [
      {
        id: '1fb78cbb-5fc1-46fd-80e5-cf541b905324',
        name: 'Capunga American Pale Ale',
        brand: 'Capunga',
        style: 'American Pale Ale',
      },
      {
        id: 'ce47b845-80bf-4f1f-b939-0fe5bc271024',
        name: 'Capunga American Lager',
        brand: 'Capunga',
        style: 'American Premium Lager',
      },
    ];

    const actualBeers = await beerStore.list();

    t.deepEqual(actualBeers, expectedBeers);
    t.end();
  },
);

createTest(1, [])(
  'BeerStore.list() returns a empty list if no beer if found from MongoConnection.find()',
  async (t, mongoConnection) => {
    const beerStore = new BeerStore(mongoConnection);
    const expectedList = [];

    const actualList = await beerStore.list();

    t.deepEqual(actualList, expectedList);
    t.end();
  },
);

createTest(0)(
  'BeerStore.exists() calls count method on MongoConnection',
  async (t, mongoConnection) => {
    const beerStore = new BeerStore(mongoConnection);

    await beerStore.exists('b02bb42d-ec78-4734-8a3b-8374ed37ef6b');

    t.true(mongoConnection.count.called);
    t.end();
  },
);

createTest(1)(
  'BeerStore.exists() returns true if MongoConnection.count() is greater than 0',
  async (t, mongoConnection) => {
    const beerStore = new BeerStore(mongoConnection);

    const expectedData = true;

    const actualData = await beerStore.exists('b02bb42d-ec78-4734-8a3b-8374ed37ef6b');

    t.deepEqual(expectedData, actualData);
    t.end();
  },
);

createTest(0)(
  'BeerStore.exists() returns false if MongoConnection.count() is equal to 0',
  async (t, mongoConnection) => {
    const beerStore = new BeerStore(mongoConnection);

    const expectedData = false;

    const actualData = await beerStore.exists('b02bb42d-ec78-4734-8a3b-8374ed37ef6b');

    t.deepEqual(expectedData, actualData);
    t.end();
  },
);

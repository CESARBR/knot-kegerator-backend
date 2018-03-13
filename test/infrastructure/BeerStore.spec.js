import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import BeerStore from 'infrastructure/BeerStore';

function createTest(countData) {
  return around(tape)
    .before(async (t) => {
      const mongoConnection = {
        count: sinon.stub().resolves(countData),
      };

      t.next(mongoConnection);
    });
}

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

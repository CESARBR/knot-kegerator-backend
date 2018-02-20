import tape from 'tape';
import around from 'tape-around';
import Setup from 'entities/Setup';
import Tap from 'entities/Tap';
import Client from 'entities/Client';
import Beer from 'entities/Beer';
import Keg from 'entities/Keg';
import TapStore from 'infrastructure/TapStore';
import TapSchema from 'infrastructure/TapSchema';
import MongoConnection from 'infrastructure/MongoConnection';

const DB_SERVER = 'localhost:27017';
const DB_NAME = 'test';

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

const test = around(tape)
  .before(async (t) => {
    const mongoConnection = new MongoConnection(DB_SERVER, DB_NAME);

    try {
      await mongoConnection.start();
    } catch (err) {
      throw err;
    }

    const tapStore = new TapStore(mongoConnection);

    const result = await mongoConnection.save('Tap', TapSchema, defaultTap);
    if (!result) {
      t.end();
    }

    t.next(tapStore, mongoConnection);
  })
  .after(async (t, tapStore, mongoConnection) => {
    await mongoConnection.deleteOne('Tap', TapSchema, { id: '118cc3b3-f582-4d12-9a4f-184543000000' });
    mongoConnection.close();
    t.end();
  });

test('updateTap() updates tap object on database', async (t, tapStore) => {
  const tap = defaultTap;
  tap.setup = new Setup(
    { id: 'f3924fe5-411a-4ee5-ac51-6484c9403f16' },
    { id: '85f15aeb-ccef-43ee-8286-0a0a11966b3e' },
    { id: 'e05634bd-a9f9-414e-ae25-f4d492d62cef' },
  );

  await tapStore.updateTap(tap);

  const result = await tapStore.getTap(tap.id);

  const actualTap = {
    id: result.id,
    name: result.name,
    waitingSetup: result.waitingSetup,
    setup: result.setup,
    volume: result.volume,
  };

  t.deepEqual(actualTap, tap);
  t.end();
});

test('throws if updateTap() tries update a device that doesn\'t exists', async (t, tapStore) => {
  const tap = defaultTap;
  tap.id = 'a8d40da5-e6f9-4766-92ec-8a0a1a177107';

  try {
    await tapStore.updateTap(tap);
    t.fail('should throw');
  } catch (err) {
    t.pass('should throw');
  }

  t.end();
});

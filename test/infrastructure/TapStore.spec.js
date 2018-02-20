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

const mongoConnection = new MongoConnection(DB_SERVER, DB_NAME);
const conn = mongoConnection.start();

const Model = conn.model('Tap', TapSchema);

const setup = new Setup(
  new Client('a42e08c1-d278-444d-9451-72f70d916c61'),
  new Beer('b60b53df-caab-41a6-9878-c00e23e504ab'),
  new Keg('518b0ef3-c9ae-49d4-8955-7aed96022aaa'),
);

const defaultTap = new Tap(
  '118cc3b3-f582-4d12-9a4f-184543000000',
  'CESAR tap',
  true,
  setup,
  10.5,
);

const test = around(tape)
  .before((t) => {
    // insert a testing purpose tap on database
    const tapModel = new Model(defaultTap);
    const tapStore = new TapStore(conn);
    tapModel.save((err) => {
      if (err) {
        t.end();
      }
    });

    t.next(tapStore);
  })
  .after((t) => {
    Model.deleteOne({ id: '118cc3b3-f582-4d12-9a4f-184543000000' });
    MongoConnection.close();
    t.end();
  });

test('setupTap() update tap object on database', async (t, tapStore) => {
  const tap = defaultTap;
  tap.setup = new Setup(
    { id: 'f3924fe5-411a-4ee5-ac51-6484c9403f16' },
    { id: '85f15aeb-ccef-43ee-8286-0a0a11966b3e' },
    { id: 'e05634bd-a9f9-414e-ae25-f4d492d62cef' },
  );

  await tapStore.setupTap(tap);

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

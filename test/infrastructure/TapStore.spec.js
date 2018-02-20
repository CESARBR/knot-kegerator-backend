import tape from 'tape';
import around from 'tape-around';
import Tap from 'entities/Tap';
import TapStore from 'infrastructure/TapStore';
import TapSchema from 'infrastructure/TapSchema';
import MongoConnection from 'infrastructure/MongoConnection';

const DB_SERVER = 'localhost:27017';
const DB_NAME = 'test';

const mongoConnection = new MongoConnection(DB_SERVER, DB_NAME);
const conn = mongoConnection.start();

const Model = conn.model('Tap', TapSchema);

const test = around(tape)
  .before((t) => {
    const tapStore = new TapStore(conn);

    const tapModel = new Model({
      id: '9392780a-1d43-47a8-ab05-b425eeee96f4',
      clientId: 'a42e08c1-d278-444d-9451-72f70d916c61',
      beerId: 'b60b53df-caab-41a6-9878-c00e23e504ab',
      kegId: '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
    });

    tapModel.save((err) => {
      if (err) {
        t.end();
      }
    });

    t.next(tapStore, tapModel);
  })
  .after((t) => {
    Model.deleteOne({ id: '9392780a-1d43-47a8-ab05-b425eeee96f4' });
    conn.disconnect();
    t.end();
  });

test('setupTap() updates tap object on database if it exists', async (t, tapStore) => {
  const expectTap = new Tap(
    '9392780a-1d43-47a8-ab05-b425eeee96f4',
    'adf54f3d-5316-406a-adc0-5bf21421e4ea',
    '4e56b7e0-bc0c-48be-b8f0-d37f330c5e0f',
    'd27e2369-390f-4d9a-bd60-8f492785f2f2',
  );
  await tapStore.setupTap(expectTap);

  Model.findOne({ id: '9392780a-1d43-47a8-ab05-b425eeee96f4' }, (err, result) => {
    const actualTap = {
      id: result.id,
      clientId: result.clientId,
      beerId: result.beerId,
      kegId: result.kegId,
    };
    t.deepEqual(actualTap, expectTap);
  });

  t.end();
});

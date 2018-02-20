import tape from 'tape';
import around from 'tape-around';
import uuidv4 from 'uuid/v4';
import Setup from 'entities/Setup';
import Tap from 'entities/Tap';
import Client from 'entities/Client';
import Beer from 'entities/Beer';
import Keg from 'entities/Keg';
import CloudTapStore from 'infrastructure/CloudTapStore';
import CloudConnection from 'infrastructure/CloudConnection';

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
  .before(async (t) => {
    const connection = new CloudConnection(
      'knot-test.cesar.org.br',
      3000,
      '76db942b-b260-49ae-a8ca-ee421fe60000',
      '070af831b40bc587d53489d4d416a09e08261eaf',
    );

    try {
      await connection.start();
    } catch (e) {
      t.fail(e);
    }

    connection.update({
      uuid: defaultTap.id,
      metadata: defaultTap,
    }, () => {});

    t.next(connection);
  });

test('setupTap() update tap object on cloud', async (t, connection) => {
  const tap = defaultTap;
  tap.setup = new Setup(
    { id: uuidv4() },
    { id: uuidv4() },
    { id: uuidv4() },
  );

  const cloudTapStore = new CloudTapStore(connection);

  await cloudTapStore.updateTap(tap);
  const cloudTap = await cloudTapStore.getTap(tap.id);

  connection.close(() => {});
  t.deepEqual(tap.setup, cloudTap.setup);
  t.end();
});

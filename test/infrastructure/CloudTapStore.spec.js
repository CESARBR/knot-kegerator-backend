import tape from 'tape';
import around from 'tape-around';
import Company from 'entities/Company';
import Setup from 'entities/Setup';
import Tap from 'entities/Tap';
import Client from 'entities/Client';
import Beer from 'entities/Beer';
import Keg from 'entities/Keg';
import CloudTapStore from 'infrastructure/CloudTapStore';
import CloudConnection from 'infrastructure/CloudConnection';

const company = new Company(
  'knot-test.cesar.org.br',
  3000,
  '76db942b-b260-49ae-a8ca-ee421fe60000',
  '070af831b40bc587d53489d4d416a09e08261eaf',
);

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
    const cloudConnection = new CloudConnection(company);
    const { connection } = cloudConnection;
    const cloudTapStore = new CloudTapStore(connection);

    // update a testing purpose tap device with defaultTap object as metadata
    connection.on('ready', () => {
      connection.update({
        uuid: defaultTap.id,
        metadata: defaultTap,
      }, () => {});
    });

    t.next(cloudTapStore);
  })
  .after((t) => {
    const cloudConnection = new CloudConnection(company);
    cloudConnection.close();
    t.end();
  });

test('setupTap() update tap object on cloud', async (t, cloudTapStore) => {
  const tap = defaultTap;
  tap.setup = new Setup(
    { id: 'f3924fe5-411a-4ee5-ac51-6484c9403f16' },
    { id: '85f15aeb-ccef-43ee-8286-0a0a11966b3e' },
    { id: 'e05634bd-a9f9-414e-ae25-f4d492d62cef' },
  );

  await cloudTapStore.setupTap(tap);
  const cloudTap = await cloudTapStore.getTap(tap);

  t.deepEqual(tap.setup, cloudTap.setup);
  t.end();
});

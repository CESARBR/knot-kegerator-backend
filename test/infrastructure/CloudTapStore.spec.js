import tape from 'tape';
import around from 'tape-around';
import meshblu from 'meshblu';
import Company from 'entities/Company';
import CloudTapStore from 'infrastructure/CloudTapStore';

const company = new Company(
  'knot-test.cesar.org.br',
  3000,
  '76db942b-b260-49ae-a8ca-ee421fe60000',
  '070af831b40bc587d53489d4d416a09e08261eaf',
);

const test = around(tape)
  .before((t) => {
    const connection = meshblu.createConnection(company);

    connection.on('ready', () => {
      const cloudTapStore = new CloudTapStore(connection);
      t.next(cloudTapStore);
    });
  });

test('setupTap() updates tap object on cloud if it exists', async (t, cloudTapStore) => {
  const expectData = {
    waitingSetup: true,
    setup: {
      id: '4f2edd9b-a8e0-4e82-a033-c637ad0a0000',
      clientId: '255557c1-2268-4df0-9a1b-173d7fe41854',
      beerId: '476b14eb-0bc8-4228-951e-348fbd4f9bfc',
      kegId: '0da5c46e-99de-4f25-b1d3-38debfa0ff4e',
    },
  };

  await cloudTapStore.setupTap(expectData.setup);

  cloudTapStore.getTap(expectData.setup.id, (err, actualData) => {
    t.deepEqual(actualData, expectData);
  });

  t.end();
});

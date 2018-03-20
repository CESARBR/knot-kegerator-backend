import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import ListClients from 'interactors/ListClients';

const test = around(tape)
  .before((t) => {
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
    const clientStore = {
      list: sinon.stub().resolves(clientsData),
    };

    t.next(clientStore);
  });

test('calls list() on store', async (t, clientStore) => {
  const interactor = new ListClients(clientStore);

  await interactor.execute();

  t.true(clientStore.list.called);
  t.end();
});

test('returns Clients returned by store', async (t, clientStore) => {
  const interactor = new ListClients(clientStore);
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

  const actualClients = await interactor.execute();

  t.deepEqual(actualClients, expectedClients);
  t.end();
});

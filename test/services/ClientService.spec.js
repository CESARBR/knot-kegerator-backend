import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import ClientService from 'services/ClientService';

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
    const listClientsInteractor = {
      execute: sinon.stub().resolves(clientsData),
    };

    const clientService = new ClientService(listClientsInteractor);
    t.next(clientService);
  });

test('listClients() calls ListClients.execute()', async (t, clientService) => {
  await clientService.listClients();

  t.true(clientService.listClientsInteractor.execute.called);
  t.end();
});

test('listClients() returns Clients returned by ListClients.execute()', async (t, clientService) => {
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
  const actualClients = await clientService.listClients();

  t.deepEqual(actualClients, expectedClients);
  t.end();
});

import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import HapiAPI from 'infrastructure/HapiAPI';
import { SetupTapRequest } from 'services/SetupTapRequest';

const test = around(tape)
  .before((t) => {
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
    const kegsData = [
      {
        id: 'd6600558-f101-45be-bf8a-4b5aed40cf9f',
        name: 'Stainless steel',
        weight: 10,
        totalVolume: 70.5,
      },
      {
        id: '58a6168c-5676-41a0-8beb-b983764eb797',
        name: 'Rubber',
        weight: 5,
        totalVolume: 70.5,
      },
    ];
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

    const tapService = {
      setup: sinon.stub().resolves(),
    };
    const beerService = {
      list: sinon.stub().resolves(beersData),
    };
    const kegService = {
      list: sinon.stub().resolves(kegsData),
    };
    const clientService = {
      list: sinon.stub().resolves(clientsData),
    };

    const hapiAPI = new HapiAPI(tapService, beerService, kegService, clientService);
    t.next(hapiAPI);
  });

test('listClients() calls ClientService.list()', async (t, hapiAPI) => {
  await hapiAPI.listClients();

  t.true(hapiAPI.clientService.list.called);
  t.end();
});

test(
  'listClients() returns a list of clients returned by ClientService.list()',
  async (t, hapiAPI) => {
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

    const actualClients = await hapiAPI.listClients();

    t.deepEqual(actualClients, expectedClients);
    t.end();
  },
);

test('listKegs() calls KegService.list()', async (t, hapiAPI) => {
  await hapiAPI.listKegs();

  t.true(hapiAPI.kegService.list.called);
  t.end();
});

test(
  'listKegs() returns a list of keg returned by KegService.list()',
  async (t, hapiAPI) => {
    const expectedKegs = [
      {
        id: 'd6600558-f101-45be-bf8a-4b5aed40cf9f',
        name: 'Stainless steel',
        weight: 10,
        totalVolume: 70.5,
      },
      {
        id: '58a6168c-5676-41a0-8beb-b983764eb797',
        name: 'Rubber',
        weight: 5,
        totalVolume: 70.5,
      },
    ];

    const actualKegs = await hapiAPI.listKegs();

    t.deepEqual(actualKegs, expectedKegs);
    t.end();
  },
);

test('listBeers() calls BeerService.list()', async (t, hapiAPI) => {
  await hapiAPI.listBeers();

  t.true(hapiAPI.beerService.list.called);
  t.end();
});

test(
  'listBeers() returns a list of beer returned by BeerService.list()',
  async (t, hapiAPI) => {
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

    const actualBeers = await hapiAPI.listBeers();

    t.deepEqual(actualBeers, expectedBeers);
    t.end();
  },
);

test('setupTap() calls TapService.setup()', async (t, hapiAPI) => {
  await hapiAPI.setupTap(
    '9392780a-1d43-47a8-ab05-b425eeee96f4',
    'a42e08c1-d278-444d-9451-72f70d916c61',
    'b60b53df-caab-41a6-9878-c00e23e504ab',
    '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
  );

  t.true(hapiAPI.tapService.setup.called);
  t.end();
});

test('setupTap() pass request with arguments received', async (t, hapiAPI) => {
  const setupData = {
    id: '9392780a-1d43-47a8-ab05-b425eeee96f4',
    clientId: 'a42e08c1-d278-444d-9451-72f70d916c61',
    beerId: 'b60b53df-caab-41a6-9878-c00e23e504ab',
    kegId: '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
  };

  await hapiAPI.setupTap(setupData);

  const expectedRequest = new SetupTapRequest(
    '9392780a-1d43-47a8-ab05-b425eeee96f4',
    'a42e08c1-d278-444d-9451-72f70d916c61',
    'b60b53df-caab-41a6-9878-c00e23e504ab',
    '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
  );
  const actualRequest = hapiAPI.tapService.setup.getCall(0).args[0];
  t.deepEqual(actualRequest, expectedRequest);
  t.end();
});

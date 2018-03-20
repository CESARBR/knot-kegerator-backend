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
    const tapService = {
      setupTap: sinon.stub().resolves(),
    };
    const beerService = {
      listBeers: sinon.stub().resolves(beersData),
    };
    const hapiAPI = new HapiAPI(tapService, beerService);
    t.next(hapiAPI);
  });


test('listBeers() calls BeerService.listBeers()', async (t, hapiAPI) => {
  await hapiAPI.listBeers();

  t.true(hapiAPI.beerService.listBeers.called);
  t.end();
});

test(
  'listBeers() returns a list of beer returned by BeerService.listBeers()',
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

test('setupTap() calls TapService.setupTap()', async (t, hapiAPI) => {
  await hapiAPI.setupTap(
    '9392780a-1d43-47a8-ab05-b425eeee96f4',
    'a42e08c1-d278-444d-9451-72f70d916c61',
    'b60b53df-caab-41a6-9878-c00e23e504ab',
    '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
  );

  t.true(hapiAPI.tapService.setupTap.called);
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
  const actualRequest = hapiAPI.tapService.setupTap.getCall(0).args[0];
  t.deepEqual(actualRequest, expectedRequest);
  t.end();
});

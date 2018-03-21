import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import TapService from 'services/TapService';
import { SetupTapRequest } from 'services/SetupTapRequest';

const test = around(tape)
  .before((t) => {
    const tapsData = [
      {
        id: '7bfe7203-2617-4590-bfac-8d48923fbf01',
        name: 'Office tap',
        waitingSetup: false,
        setup: {
          client: {
            id: '325163c5-7f5d-46a7-beb6-45e94cb73f0f',
            name: 'CESAR',
          },
          beer: {
            id: '1fb78cbb-5fc1-46fd-80e5-cf541b905324',
            name: 'Capunga American Pale Ale',
            brand: 'Capunga',
            style: 'American Pale Ale',
          },
          keg: {
            id: 'd6600558-f101-45be-bf8a-4b5aed40cf9f',
            name: 'Stainless steel',
            weight: 10,
            totalVolume: 50,
          },
        },
        volume: 10.5,
      },
      {
        id: 'da412ca4-e2c4-4475-8461-abfffabde9e5',
        name: 'Market tap',
        waitingSetup: true,
      },
    ];
    const setupTapInteractor = {
      execute: sinon.stub().resolves(),
    };
    const listTapsInteractor = {
      execute: sinon.stub().resolves(tapsData),
    };

    const tapService = new TapService(setupTapInteractor, listTapsInteractor);
    t.next(tapService);
  });

test('listTaps() calls ListTaps.execute()', async (t, tapService) => {
  await tapService.listTaps();

  t.true(tapService.listTapsInteractor.execute.called);
  t.end();
});

test('listTaps() returns Taps returned by ListTaps.execute()', async (t, tapService) => {
  const expectedTaps = [
    {
      id: '7bfe7203-2617-4590-bfac-8d48923fbf01',
      name: 'Office tap',
      waitingSetup: false,
      setup: {
        client: {
          id: '325163c5-7f5d-46a7-beb6-45e94cb73f0f',
          name: 'CESAR',
        },
        beer: {
          id: '1fb78cbb-5fc1-46fd-80e5-cf541b905324',
          name: 'Capunga American Pale Ale',
          brand: 'Capunga',
          style: 'American Pale Ale',
        },
        keg: {
          id: 'd6600558-f101-45be-bf8a-4b5aed40cf9f',
          name: 'Stainless steel',
          weight: 10,
          totalVolume: 50,
        },
      },
      volume: 10.5,
    },
    {
      id: 'da412ca4-e2c4-4475-8461-abfffabde9e5',
      name: 'Market tap',
      waitingSetup: true,
    },
  ];
  const actualTaps = await tapService.listTaps();

  t.deepEqual(actualTaps, expectedTaps);
  t.end();
});

test('setupTap() calls SetupTap.execute()', async (t, tapService) => {
  const request = new SetupTapRequest(
    '9392780a-1d43-47a8-ab05-b425eeee96f4',
    'a42e08c1-d278-444d-9451-72f70d916c61',
    'b60b53df-caab-41a6-9878-c00e23e504ab',
    '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
  );
  await tapService.setupTap(request);

  t.true(tapService.setupTapInteractor.execute.called);
  t.end();
});

test('setupTap() calls SetupTap.execute() with request', async (t, tapService) => {
  const request = new SetupTapRequest(
    '9392780a-1d43-47a8-ab05-b425eeee96f4',
    'a42e08c1-d278-444d-9451-72f70d916c61',
    'b60b53df-caab-41a6-9878-c00e23e504ab',
    '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
  );
  await tapService.setupTap(request);

  const actualRequest = tapService.setupTapInteractor.execute.getCall(0).args[0];
  t.deepEqual(actualRequest, request);
  t.end();
});

test('setupTap() validates request', async (t, tapService) => {
  try {
    await tapService.setupTap();
    t.fail('should throw');
  } catch (e) {
    t.pass('should throw');
  }
  t.end();
});

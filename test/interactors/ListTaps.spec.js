import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import ListTaps from 'interactors/ListTaps';

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

    const tapStore = {
      getAll: sinon.stub().resolves(tapsData),
    };

    t.next(tapStore);
  });

test('calls getAll() on store', async (t, tapStore) => {
  const interactor = new ListTaps(tapStore);

  await interactor.execute();

  t.true(tapStore.getAll.called);
  t.end();
});

test('returns Taps returned by store', async (t, tapStore) => {
  const interactor = new ListTaps(tapStore);
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

  const actualTaps = await interactor.execute();

  t.deepEqual(actualTaps, expectedTaps);
  t.end();
});

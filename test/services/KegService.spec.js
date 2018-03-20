import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import KegService from 'services/KegService';

const test = around(tape)
  .before((t) => {
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
    const listKegsInteractor = {
      execute: sinon.stub().resolves(kegsData),
    };

    const kegService = new KegService(listKegsInteractor);
    t.next(kegService);
  });

test('list() calls ListKegs.execute()', async (t, kegService) => {
  await kegService.list();

  t.true(kegService.listKegsInteractor.execute.called);
  t.end();
});

test('list() returns Kegs returned by ListKegs.execute()', async (t, kegService) => {
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
  const actualKegs = await kegService.list();

  t.deepEqual(actualKegs, expectedKegs);
  t.end();
});

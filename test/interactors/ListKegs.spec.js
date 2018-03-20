import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import ListKegs from 'interactors/ListKegs';

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
    const kegStore = {
      list: sinon.stub().resolves(kegsData),
    };

    t.next(kegStore);
  });

test('calls list() on store', async (t, kegStore) => {
  const interactor = new ListKegs(kegStore);

  await interactor.execute();

  t.true(kegStore.list.called);
  t.end();
});

test('returns Kegs returned by store', async (t, kegStore) => {
  const interactor = new ListKegs(kegStore);
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

  const actualKegs = await interactor.execute();

  t.deepEqual(actualKegs, expectedKegs);
  t.end();
});

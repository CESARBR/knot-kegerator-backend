import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import ListBeers from 'interactors/ListBeers';

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

    const beerStore = {
      getAll: sinon.stub().resolves(beersData),
    };

    t.next(beerStore);
  });

test('calls getAll() on store', async (t, beerStore) => {
  const interactor = new ListBeers(beerStore);

  await interactor.execute();

  t.true(beerStore.getAll.called);
  t.end();
});

test('returns Beers returned by store', async (t, beerStore) => {
  const interactor = new ListBeers(beerStore);
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

  const actualBeers = await interactor.execute();

  t.deepEqual(actualBeers, expectedBeers);
  t.end();
});

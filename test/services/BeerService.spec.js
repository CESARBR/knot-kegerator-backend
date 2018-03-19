import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import BeerService from 'services/BeerService';

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
    const listBeersInteractor = {
      execute: sinon.stub().resolves(beersData),
    };

    const beerService = new BeerService(listBeersInteractor);
    t.next(beerService);
  });

test('listBeers() calls ListBeers.execute()', async (t, beerService) => {
  await beerService.listBeers();

  t.true(beerService.listBeersInteractor.execute.called);
  t.end();
});

test('listBeers() returns Beers returned by ListBeers.execute()', async (t, beerService) => {
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
  const actualBeers = await beerService.listBeers();

  t.deepEqual(actualBeers, expectedBeers);
  t.end();
});

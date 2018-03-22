import BeerSchema from 'infrastructure/BeerSchema';
import KegSchema from 'infrastructure/KegSchema';
import ClientSchema from 'infrastructure/ClientSchema';
import TapSchema from 'infrastructure/TapSchema';
import MongoConnection from 'infrastructure/MongoConnection';

const DB_SERVER = 'localhost:27017';
const DB_NAME = 'test';

const mongoConnection = new MongoConnection(DB_SERVER, DB_NAME);

async function insertBeers() {
  const beers = [
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
    {
      id: '90c01a4e-0507-495d-8f64-f749e4504cb9',
      name: 'EKÄUT Munich Helles',
      brand: 'EKÄUT',
      style: 'Munich Helles',
    },
  ];

  const dbBeers = await mongoConnection.find('Beer', BeerSchema);

  if (!dbBeers.length) {
    await mongoConnection.save('Beer', BeerSchema, beers[0]);
    await mongoConnection.save('Beer', BeerSchema, beers[1]);
    await mongoConnection.save('Beer', BeerSchema, beers[2]);
  }
}

async function insertKegs() {
  const kegs = [
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

  const dbKegs = await mongoConnection.find('Keg', KegSchema);

  if (!dbKegs.length) {
    await mongoConnection.save('Keg', KegSchema, kegs[0]);
    await mongoConnection.save('Keg', KegSchema, kegs[1]);
  }
}

async function insertClients() {
  const clients = [
    {
      id: '325163c5-7f5d-46a7-beb6-45e94cb73f0f',
      name: 'CESAR',
    },
    {
      id: '3dd28356-a2bd-4a2b-ba26-22acfd2069c9',
      name: 'Impact Hub',
    },
  ];

  const dbClients = await mongoConnection.find('Client', ClientSchema);

  if (!dbClients.length) {
    await mongoConnection.save('Client', ClientSchema, clients[0]);
    await mongoConnection.save('Client', ClientSchema, clients[1]);
  }
}

async function insertTaps() {
  const taps = [
    {
      id: '7bfe7203-2617-4590-bfac-8d48923fbf01',
      name: 'Office tap',
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
    },
    {
      id: 'da412ca4-e2c4-4475-8461-abfffabde9e5',
      name: 'Market tap',
    },
  ];

  const dbTaps = await mongoConnection.find('Tap', TapSchema);

  if (!dbTaps.length) {
    await mongoConnection.save('Tap', TapSchema, taps[0]);
    await mongoConnection.save('Tap', TapSchema, taps[1]);
  }
}

async function run() {
  await mongoConnection.start();
  await insertBeers();
  await insertClients();
  await insertKegs();
  await insertTaps();
  await mongoConnection.close();
}

run();

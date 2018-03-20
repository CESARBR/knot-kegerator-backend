// Domain
import SetupTap from 'interactors/SetupTap';
import ListBeers from 'interactors/ListBeers';
import ListKegs from 'interactors/ListKegs';
import TapService from 'services/TapService';
import BeerService from 'services/BeerService';
import KegService from 'services/KegService';

// Infrastructure
import MongoConnection from 'infrastructure/MongoConnection';
import CloudConnection from 'infrastructure/CloudConnection';

import BeerSchema from 'infrastructure/BeerSchema';
import KegSchema from 'infrastructure/KegSchema';

import TapBoundStore from 'infrastructure/TapBoundStore';

import TapStore from 'infrastructure/TapStore';
import CloudTapStore from 'infrastructure/CloudTapStore';
import ClientStore from 'infrastructure/ClientStore';
import BeerStore from 'infrastructure/BeerStore';
import KegStore from 'infrastructure/KegStore';

import HapiAPI from 'infrastructure/HapiAPI';
import HapiServer from 'infrastructure/HapiServer';

const DB_SERVER = 'localhost:27017';
const DB_NAME = 'test';

const CLOUD_SERVER = '10.42.0.91';
const CLOUD_PORT = 3000;
const COMPANY_UUID = '46dcecf4-968f-4a0f-bbad-47b6debf0008';
const COMPANY_TOKEN = 'bc2b291eb2dde1dcd3f379c84ac4085284d75b49';

const mongoConnection = new MongoConnection(DB_SERVER, DB_NAME);
const cloudConnetion = new CloudConnection(
  CLOUD_SERVER,
  CLOUD_PORT,
  COMPANY_UUID,
  COMPANY_TOKEN,
);

const mongoTapStore = new TapStore(mongoConnection);
const cloudTapStore = new CloudTapStore(cloudConnetion);

const tapStore = new TapBoundStore(mongoTapStore, cloudTapStore);

const clientStore = new ClientStore(mongoConnection);
const beerStore = new BeerStore(mongoConnection);
const kegStore = new KegStore(mongoConnection);

const setupTapInteractor = new SetupTap(tapStore, clientStore, beerStore, kegStore);
const listBeersInteractor = new ListBeers(beerStore);
const listKegsInteractor = new ListKegs(kegStore);

const tapService = new TapService(setupTapInteractor);
const beerService = new BeerService(listBeersInteractor);
const kegService = new KegService(listKegsInteractor);

const hapiAPI = new HapiAPI(tapService, beerService, kegService);
const hapiServer = new HapiServer(hapiAPI);

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

async function run() {
  await mongoConnection.start();
  await cloudConnetion.start();
  await hapiServer.start();
  await insertBeers();
  await insertKegs();
}

run();

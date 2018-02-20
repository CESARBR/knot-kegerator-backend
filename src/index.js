// Domain
import SetupTap from 'interactors/SetupTap';
import TapService from 'services/TapService';

// Infrastructure
import MongoConnection from 'infrastructure/MongoConnection';
import CloudConnection from 'infrastructure/CloudConnection';

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
const tapService = new TapService(setupTapInteractor);

const hapiAPI = new HapiAPI(tapService);
const hapiServer = new HapiServer(hapiAPI);

async function run() {
  await mongoConnection.start();
  await cloudConnetion.start();
  await hapiServer.start();
}

run();

// Domain
import SetupTap from 'interactors/SetupTap';
import ListBeers from 'interactors/ListBeers';
import ListKegs from 'interactors/ListKegs';
import ListClients from 'interactors/ListClients';
import TapService from 'services/TapService';
import BeerService from 'services/BeerService';
import KegService from 'services/KegService';
import ClientService from 'services/ClientService';

// Infrastructure
import MongoConnection from 'infrastructure/MongoConnection';
import CloudConnection from 'infrastructure/CloudConnection';

import TapStore from 'infrastructure/TapStore';

import DatabaseTapStore from 'infrastructure/DatabaseTapStore';
import CloudTapStore from 'infrastructure/CloudTapStore';
import ClientStore from 'infrastructure/ClientStore';
import BeerStore from 'infrastructure/BeerStore';
import KegStore from 'infrastructure/KegStore';

import HapiAPI from 'infrastructure/HapiAPI';
import HapiServer from 'infrastructure/HapiServer';

const DB_SERVER = 'localhost:27017';
const DB_NAME = 'test';

const CLOUD_SERVER = 'knot-test.cesar.org.br';
const CLOUD_PORT = 3001;
const COMPANY_UUID = '62665279-e437-41a9-967e-e57146760000';
const COMPANY_TOKEN = '1e6420973bbd84365f4c943302824f320b35906c';

const mongoConnection = new MongoConnection(DB_SERVER, DB_NAME);
const cloudConnetion = new CloudConnection(
  CLOUD_SERVER,
  CLOUD_PORT,
  COMPANY_UUID,
  COMPANY_TOKEN,
);

const databaseTapStore = new DatabaseTapStore(mongoConnection);
const cloudTapStore = new CloudTapStore(cloudConnetion);

const clientStore = new ClientStore(mongoConnection);
const beerStore = new BeerStore(mongoConnection);
const kegStore = new KegStore(mongoConnection);

const tapStore = new TapStore(databaseTapStore, cloudTapStore, beerStore, kegStore);

const setupTapInteractor = new SetupTap(tapStore, clientStore, beerStore, kegStore);
const listBeersInteractor = new ListBeers(beerStore);
const listKegsInteractor = new ListKegs(kegStore);
const listClientsInteractor = new ListClients(clientStore);

const tapService = new TapService(setupTapInteractor);
const beerService = new BeerService(listBeersInteractor);
const kegService = new KegService(listKegsInteractor);
const clientService = new ClientService(listClientsInteractor);

const hapiAPI = new HapiAPI(tapService, beerService, kegService, clientService);
const hapiServer = new HapiServer(hapiAPI);

async function run() {
  await mongoConnection.start();
  await cloudConnetion.start();
  await hapiServer.start();
}

run();

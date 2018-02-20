// Domain
import SetupTap from 'interactors/SetupTap';
import TapService from 'services/TapService';

// Infrastructure
import MongoConnection from 'infrastructure/MongoConnection';
import CloudConnection from 'infrastructure/CloudConnection';
import TapStore from 'infrastructure/TapStore';
import CloudTapStore from 'infrastructure/CloudTapStore';
import HapiAPI from 'infrastructure/HapiAPI';
import HapiServer from 'infrastructure/HapiServer';

const DB_SERVER = 'localhost:27017';
const DB_NAME = 'test';

const CLOUD_SERVER = 'knot-test.cesar.org.br';
const CLOUD_PORT = 3000;
const COMPANY_UUID = '76db942b-b260-49ae-a8ca-ee421fe60000';
const COMPANY_TOKEN = '070af831b40bc587d53489d4d416a09e08261eaf';

const mongoConnection = new MongoConnection(DB_SERVER, DB_NAME);
const cloudConnetion = new CloudConnection(
  CLOUD_SERVER,
  CLOUD_PORT,
  COMPANY_UUID,
  COMPANY_TOKEN,
);

const tapStore = new TapStore(mongoConnection);
const cloudTapStore = new CloudTapStore(cloudConnetion);

const mongoStore = {
  tap: tapStore,
};

const cloudStore = {
  tap: cloudTapStore
};

const setupTapInteractor = new SetupTap(mongoStore, cloudStore);
const tapService = new TapService(setupTapInteractor);

const hapiAPI = new HapiAPI(tapService);
const hapiServer = new HapiServer(hapiAPI);

async function run() {
  await mongoConnection.start();
  await cloudConnetion.start();
  await hapiServer.start();
}

run();

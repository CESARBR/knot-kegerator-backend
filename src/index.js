// Domain
import Company from 'entities/Company';
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

const company = new Company(
  'knot-test.cesar.org.br',
  3000,
  '76db942b-b260-49ae-a8ca-ee421fe60000',
  '070af831b40bc587d53489d4d416a09e08261eaf',
);

const mongoConnection = new MongoConnection(DB_SERVER, DB_NAME);
const cloudConnetion = new CloudConnection(company);
const tapStore = new TapStore(mongoConnection.start());
const cloudTapStore = new CloudTapStore(cloudConnetion.start());

const setupTapInteractor = new SetupTap(tapStore, cloudTapStore);
const tapService = new TapService(setupTapInteractor);

const hapiAPI = new HapiAPI(tapService);
const hapiServer = new HapiServer(hapiAPI);

async function run() {
  await hapiServer.start();
}

run();

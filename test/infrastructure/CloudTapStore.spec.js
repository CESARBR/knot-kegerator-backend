import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import Setup from 'entities/Setup';
import Tap from 'entities/Tap';
import Client from 'entities/Client';
import Beer from 'entities/Beer';
import Keg from 'entities/Keg';
import EntityNotFoundError from 'entities/EntityNotFoundError';
import CloudTapStore from 'infrastructure/CloudTapStore';

const test = around(tape)
  .before(async (t) => {
    const setup = new Setup(
      new Client('a42e08c1-d278-444d-9451-72f70d916c61'),
      new Beer('b60b53df-caab-41a6-9878-c00e23e504ab'),
      new Keg('518b0ef3-c9ae-49d4-8955-7aed96022aaa'),
    );
    const tap = new Tap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      'CESAR tap',
      true,
      setup,
      10.5,
    );
    const message = {
      devices: ['*'],
      payload: {
        sensor_id: '1',
        value: 'false',
        uuid: '46dcecf4-968f-4a0f-bbad-47b6debf0008',
        timestamp: '2018-03-15T01:48:37.967Z',
        _id: '5aa9d0f580d293033d766c32',
      },
      fromUuid: '46dcecf4-968f-4a0f-bbad-47b6debf0008',
    };

    const cloudConnection = {
      on: sinon.stub().resolves(message),
      device: sinon.stub().resolves(tap),
      update: sinon.stub().resolves(),
      subscribe: sinon.stub().resolves(),
      unsubscribe: sinon.stub().resolves(),
    };

    t.next(cloudConnection);
  });

test('CloudTapStore.get() throws EntityNotFoundError if tap doesn\'t exists', async (t, cloudConnection) => {
  const connection = cloudConnection;
  connection.device = sinon.stub().resolves(null);

  const cloudTapStore = new CloudTapStore(connection);

  try {
    await cloudTapStore.get('118cc3b3-f582-4d12-9a4f-184543000000');
    t.fail('should throw');
  } catch (e) {
    if (e instanceof EntityNotFoundError) {
      t.pass('should throw');
    } else {
      t.fail('should throw');
    }
  }

  t.end();
});

test('CloudTapStore.get() calls update method on CloudConnection', async (t, cloudConnection) => {
  const cloudTapStore = new CloudTapStore(cloudConnection);
  cloudTapStore.getDataFromSensor = sinon.stub().resolves();

  await cloudTapStore.get('118cc3b3-f582-4d12-9a4f-184543000000');

  t.true(cloudConnection.update.called);
  t.end();
});

test(
  'CloudTapStore.get() returns Tap filled with sensor values returned by getDataFromSensor()',
  async (t, cloudConnection) => {
    const cloudTapStore = new CloudTapStore(cloudConnection);

    cloudTapStore.getDataFromSensor = sinon.stub();
    cloudTapStore.getDataFromSensor.onCall(0).resolves('false');
    cloudTapStore.getDataFromSensor.onCall(1).resolves('15.4');

    const expectTap = new Tap(
      '46dcecf4-968f-4a0f-bbad-47b6debf0008',
      undefined,
      false,
      undefined,
      15.4,
    );

    const actualTap = await cloudTapStore.get('46dcecf4-968f-4a0f-bbad-47b6debf0008');

    t.deepEqual(expectTap, actualTap);
    t.end();
  },
);

test(
  'CloudTapStore.getDataFromSensor() calls subscribe method on CloudConnection',
  async (t, cloudConnection) => {
    const cloudTapStore = new CloudTapStore(cloudConnection);

    await cloudTapStore.getDataFromSensor(
      '46dcecf4-968f-4a0f-bbad-47b6debf0008',
      1,
    );

    t.true(cloudConnection.subscribe.called);
    t.end();
  },
);

test(
  'CloudTapStore.getDataFromSensor() calls `on` method on CloudConnection',
  async (t, cloudConnection) => {
    const cloudTapStore = new CloudTapStore(cloudConnection);

    await cloudTapStore.getDataFromSensor(
      '46dcecf4-968f-4a0f-bbad-47b6debf0008',
      1,
    );

    t.true(cloudConnection.on.called);
    t.end();
  },
);


test(
  'CloudTapStore.getDataFromSensor() returns sensor data from message event on CloudConnection',
  async (t, cloudConnection) => {
    const cloudTapStore = new CloudTapStore(cloudConnection);

    const expectedSensorData = 'false';

    const actualSensorData = await cloudTapStore.getDataFromSensor(
      '46dcecf4-968f-4a0f-bbad-47b6debf0008',
      1,
    );

    t.deepEqual(expectedSensorData, actualSensorData);
    t.end();
  },
);


test(
  'CloudTapStore.update() calls update method on CloudConnection',
  async (t, cloudConnection) => {
    const cloudTapStore = new CloudTapStore(cloudConnection);
    const setup = new Setup(
      new Client('a42e08c1-d278-444d-9451-72f70d916c61'),
      new Beer(
        'b60b53df-caab-41a6-9878-c00e23e504ab',
        'Apolo Capunga Larger',
        'Capunga',
        'Larger',
      ),
      new Keg(
        '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
        'Oak Keg',
        50.0,
        75.0,
      ),
    );

    const tap = new Tap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      'CESAR tap',
      true,
      setup,
      10.5,
    );

    await cloudTapStore.update(tap);

    t.true(cloudConnection.update.called);
    t.end();
  },
);

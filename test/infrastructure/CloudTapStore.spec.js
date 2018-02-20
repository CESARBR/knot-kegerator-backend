import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import Setup from 'entities/Setup';
import Tap from 'entities/Tap';
import EntityNotFoundError from 'entities/EntityNotFoundError';
import CloudTapStore from 'infrastructure/CloudTapStore';

const test = around(tape)
  .before(async (t) => {
    // General tap representation
    const setup = new Setup(
      'a42e08c1-d278-444d-9451-72f70d916c61',
      'b60b53df-caab-41a6-9878-c00e23e504ab',
      '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
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
        uuid: '118cc3b3-f582-4d12-9a4f-184543000000',
        timestamp: '2018-03-15T01:48:37.967Z',
        _id: '5aa9d0f580d293033d766c32',
      },
      fromUuid: '118cc3b3-f582-4d12-9a4f-184543000000',
    };

    const response = {
      uuid: '118cc3b3-f582-4d12-9a4f-184543000000',
      status: 200,
    };

    const cloudConnection = {
      on: sinon.stub().resolves(message),
      device: sinon.stub().resolves(tap),
      update: sinon.stub().resolves(response),
      subscribe: sinon.stub().resolves(),
      unsubscribe: sinon.stub().resolves(),
    };

    t.next(cloudConnection);
  });

test(
  'CloudTapStore.getDataFromSensor() calls update method on CloudConnection',
  async (t, cloudConnection) => {
    const cloudTapStore = new CloudTapStore(cloudConnection);
    await cloudTapStore.getDataFromSensor(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      1,
    );

    t.true(cloudTapStore.connection.update.called);
    t.end();
  },
);


test(
  'CloudTapStore.getDataFromSensor() calls subscribe method on CloudConnection',
  async (t, cloudConnection) => {
    const cloudTapStore = new CloudTapStore(cloudConnection);
    await cloudTapStore.getDataFromSensor(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      1,
    );

    t.true(cloudTapStore.connection.subscribe.called);
    t.end();
  },
);

test(
  'CloudTapStore.getDataFromSensor() calls `on` method on CloudConnection',
  async (t, cloudConnection) => {
    const cloudTapStore = new CloudTapStore(cloudConnection);
    await cloudTapStore.getDataFromSensor(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      1,
    );

    t.true(cloudTapStore.connection.on.called);
    t.end();
  },
);

test(
  'CloudTapStore.getDataFromSensor() calls unsubscribe method on CloudConnection',
  async (t, cloudConnection) => {
    const cloudTapStore = new CloudTapStore(cloudConnection);
    await cloudTapStore.getDataFromSensor(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      1,
    );

    t.true(cloudTapStore.connection.unsubscribe.called);
    t.end();
  },
);


test(
  'CloudTapStore.getDataFromSensor() returns sensor data from message event on CloudConnection',
  async (t, cloudConnection) => {
    const cloudTapStore = new CloudTapStore(cloudConnection);
    const expectedSensorData = 'false';

    const actualSensorData = await cloudTapStore.getDataFromSensor(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      1,
    );

    t.deepEqual(expectedSensorData, actualSensorData);
    t.end();
  },
);

test(
  'CloudTapStore.get() throws EntityNotFoundError if tap doesn\'t exists',
  async (t, cloudConnection) => {
    const connection = cloudConnection;
    connection.device = sinon.stub().rejects();

    const cloudTapStore = new CloudTapStore(cloudConnection);

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
  },
);

test(
  'CloudTapStore.update() calls update method on CloudConnection',
  async (t, cloudConnection) => {
    const cloudTapStore = new CloudTapStore(cloudConnection);
    await cloudTapStore.update('118cc3b3-f582-4d12-9a4f-184543000000', 50, 'American Pale Ale');

    t.true(cloudTapStore.connection.update.called);
    t.end();
  },
);

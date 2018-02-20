import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import EntityNotFoundError from 'entities/EntityNotFoundError';
import CloudTap from 'infrastructure/CloudTap';
import CloudTapStore from 'infrastructure/CloudTapStore';

const test = around(tape)
  .before(async (t) => {
    const tap = {
      device: {
        uuid: '118cc3b3-f582-4d12-9a4f-184543000000',
        online: true,
      },
    };

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
  'CloudTapStore.get() returns cloud tap data',
  async (t, cloudConnection) => {
    const cloudTapStore = new CloudTapStore(cloudConnection);

    cloudTapStore.getDataFromSensor = sinon.stub();

    cloudTapStore.getDataFromSensor.onCall(0).resolves(false);
    cloudTapStore.getDataFromSensor.onCall(1).resolves(37.7);

    const expectedTap = new CloudTap(
      '118cc3b3-f582-4d12-9a4f-184543000000',
      false,
      37.7,
    );

    const actualTap = await cloudTapStore.get('118cc3b3-f582-4d12-9a4f-184543000000');

    t.deepEqual(actualTap, expectedTap);
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

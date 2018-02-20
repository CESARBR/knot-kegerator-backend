import EntityNotFoundError from 'entities/EntityNotFoundError';
import CloudTap from 'infrastructure/CloudTap';

const SETUP_REQUEST_ID = 1;
const REMAINING_VOLUME_ID = 2;
const TOTAL_VOLUME_ID = 3;
const BEER_TYPE_ID = 4;

class CloudTapStore {
  constructor(connection) {
    this.connection = connection;
  }

  async getDataFromSensor(tapId, sensorId) {
    await this.connection.update({
      uuid: tapId,
      get_data: [{
        sensor_id: sensorId,
      }],
    });

    this.connection.subscribe({ uuid: tapId });

    const data = await this.connection.on('message');

    return new Promise((resolve, reject) => {
      if (data.payload.sensor_id === String(sensorId)) {
        this.connection.unsubscribe({ uuid: tapId });
        return resolve(data.payload.value);
      }
      return reject();
    });
  }

  async get(id) {
    try {
      await this.connection.device({ uuid: id });
    } catch (err) {
      throw new EntityNotFoundError('Tap', id);
    }

    const waitingSetup = await this.getDataFromSensor(id, SETUP_REQUEST_ID);
    const remainingVolume = await this.getDataFromSensor(id, REMAINING_VOLUME_ID);

    return new CloudTap(
      id,
      waitingSetup === 'true',
      parseFloat(remainingVolume),
    );
  }

  async update(id, beerStyle, kegTotalVolume) {
    await this.connection.update({
      uuid: id,
      set_data: [{
        sensor_id: TOTAL_VOLUME_ID,
        value: Number(kegTotalVolume),
      }],
    });

    await this.connection.update({
      uuid: id,
      set_data: [{
        sensor_id: BEER_TYPE_ID,
        value: beerStyle,
      }],
    });
  }
}

export default CloudTapStore;

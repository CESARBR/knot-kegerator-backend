/* eslint-disable class-methods-use-this */
import EntityNotFoundError from 'entities/EntityNotFoundError';
import CloudTap from 'infrastructure/CloudTap';
import fs from 'fs';

const SETUP_REQUEST_ID = 1;
const REMAINING_VOLUME_ID = 2;
const TOTAL_VOLUME_ID = 3;
const BEER_TYPE_ID = 4;

class CloudTapStore {
  constructor(connection) {
    this.connection = connection;
  }

  async getDataFromSensor(tapId, sensorId) {
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

    await this.connection.update({
      uuid: id,
      get_data: [{
        sensor_id: SETUP_REQUEST_ID,
      }],
    });

    const waitingSetup = await this.getDataFromSensor(id, SETUP_REQUEST_ID);

    await this.connection.update({
      uuid: id,
      get_data: [{
        sensor_id: REMAINING_VOLUME_ID,
      }],
    });

    const remainingVolume = await this.getDataFromSensor(id, REMAINING_VOLUME_ID);

    return new CloudTap(
      id,
      waitingSetup === 'true',
      parseFloat(remainingVolume),
    );
  }

  async getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile('custom-cloud-data.json', (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(data));
      });
    });
  }

  async update(tap) {
    await this.connection.update({
      uuid: tap.id,
      set_data: [{
        sensor_id: TOTAL_VOLUME_ID,
        value: tap.setup.keg.totalVolume,
      }],
    });

    await this.connection.update({
      uuid: tap.id,
      set_data: [{
        sensor_id: BEER_TYPE_ID,
        value: tap.setup.beer.style,
      }],
    });
  }
}

export default CloudTapStore;

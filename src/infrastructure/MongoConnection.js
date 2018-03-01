import mongoose from 'mongoose';
import Logger from 'infrastructure/Logger';

class MongoConnection {
  constructor(dbServer, dbName) {
    this.dbURL = `mongodb://${dbServer}/${dbName}`;
    this.mongoose = mongoose;
  }

  start() {
    Logger.debug('info', 'starting mongo connection');
    this.mongoose.connect(this.dbURL);

    return new Promise((resolve, reject) => {
      this.mongoose.connection.on('connected', () => {
        Logger.debug('info', 'mongo connection established');
        resolve();
      });
      this.mongoose.connection.on('error', (err) => {
        Logger.debug('error', 'mongo connection failed');
        reject(err);
      });
    });
  }

  close() {
    this.mongoose.disconnect();
  }

  findOne(name, schema, query) {
    const Model = this.mongoose.model(name, schema);
    return Model.findOne(query);
  }

  findOneAndUpdate(name, schema, query, update) {
    const Model = this.mongoose.model(name, schema);
    return Model.findOneAndUpdate(query, update);
  }

  save(name, schema, data) {
    const Model = this.mongoose.model(name, schema);
    const dataModel = new Model(data);
    return dataModel.save();
  }

  deleteOne(name, schema, query) {
    const Model = this.mongoose.model(name, schema);
    return Model.deleteOne(query);
  }
}

export default MongoConnection;

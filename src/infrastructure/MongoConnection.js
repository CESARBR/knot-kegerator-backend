import mongoose from 'mongoose';

class MongoConnection {
  constructor(dbServer, dbName) {
    this.dbURL = `mongodb://${dbServer}/${dbName}`;
    this.mongoose = mongoose;
  }

  start() {
    this.mongoose.connect(this.dbURL);

    return new Promise((resolve, reject) => {
      this.mongoose.connection.on('connected', () => resolve());
      this.mongoose.connection.on('error', err => reject(err));
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

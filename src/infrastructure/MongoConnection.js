import mongoose from 'mongoose';

class MongoConnection {
  constructor(dbServer, dbName) {
    this.dbURL = `mongodb://${dbServer}/${dbName}`;
  }

  async start() {
    this.mongoose = await mongoose.connect(this.dbURL);
    return this.mongoose;
  }

  async close() {
    await this.mongoose.disconnect();
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

  count(name, schema, query) {
    const Model = this.mongoose.model(name, schema);
    const count = Model.count(query);
    return count.exec();
  }
}

export default MongoConnection;

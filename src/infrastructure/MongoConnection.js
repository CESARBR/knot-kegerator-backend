/* eslint-disable no-console */
import mongoose from 'mongoose';

class MongoConnection {
  constructor(dbServer, dbName) {
    this.dbURL = `mongodb://${dbServer}/${dbName}`;
  }

  start() {
    mongoose.connect(this.dbURL);

    mongoose.connection.on('connected', () => {
      console.log(`Database connection successful on ${this.dbURL}`);
    });

    mongoose.connection.on('error', (err) => {
      console.log(`Database connection error: ${err}`);
    });

    return mongoose;
  }

  static close() {
    mongoose.disconnect();
  }
}

export default MongoConnection;

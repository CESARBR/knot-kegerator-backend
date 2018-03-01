import winston from 'winston';

class Logger {
  constructor(options = {
    timestamp: true,
    colorize: true,
  }) {
    this.options = options;
    this.start();
  }

  start() {
    this.logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)(this.options),
      ],
    });

    return new Promise((resolve, reject) => {
      this.logger.on('error', err => reject(err));
      return resolve();
    });
  }

  debug(type, message) {
    return this.logger.log(type, message);
  }
}

export default new Logger();

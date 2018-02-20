/* eslint-disable no-console */
import hapi from 'hapi';

const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 8080;

function handleError(err, h) {
  if (err.code === 403) {
    return h.response().code(403);
  }
  if (err.code === 404) {
    return h.response().code(404);
  }
  if (err.name === 'ValidationError') {
    const message = { error: err.details[0].message };
    return h.response(message).code(422);
  }

  return h.response(err);
}

class HapiServer {
  constructor(kegeratorApi) {
    this.kegeratorApi = kegeratorApi;
  }

  async start() {
    const server = hapi.server({
      host: process.env.HOST || DEFAULT_HOST,
      port: parseInt(process.env.PORT, 10) || DEFAULT_PORT,
    });

    try {
      await server.route(this.createServerRoutes());
      await server.start();
      console.log(`Server is running at ${server.info.uri}...`);
    } catch (e) {
      console.error(e);
    }
  }

  createServerRoutes() {
    const routes = [
      {
        method: 'POST',
        path: '/taps/{id}/setup',
        handler: this.setupTapHandler.bind(this),
      },
    ];

    return routes;
  }

  async setupTapHandler(request, h) {
    const tapData = {
      id: request.params.id,
      clientId: request.payload.clientId,
      beerId: request.payload.beerId,
      kegId: request.payload.kegId,
    };

    try {
      await this.kegeratorApi.setupTap(tapData);
    } catch (err) {
      return handleError(err, h);
    }

    return h.response().code(204);
  }
}

export default HapiServer;

/* eslint-disable no-console */
import ValidationError from 'entities/ValidationError';
import EntityNotFoundError from 'entities/EntityNotFoundError';
import InvalidStateError from 'entities/InvalidStateError';
import hapi from 'hapi';

const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 8080;

function handleError(err, h) {
  if (err instanceof ValidationError) {
    const message = { error: err.toString(), details: err.details };
    return h.response(message).code(422);
  }
  if (err instanceof EntityNotFoundError) {
    const message = { error: err.toString(), id: err.id };
    return h.response(message).code(404);
  }
  if (err instanceof InvalidStateError) {
    const message = { error: err.toString(), id: err.id };
    return h.response(message).code(403);
  }

  return h.response(err.toString());
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
      {
        method: 'GET',
        path: '/beers',
        handler: this.listBeersHandler.bind(this),
      },
      {
        method: 'GET',
        path: '/kegs',
        handler: this.listKegsHandler.bind(this),
      },
      {
        method: 'GET',
        path: '/clients',
        handler: this.listClientsHandler.bind(this),
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

  async listBeersHandler(request, h) {
    let data;
    try {
      data = await this.kegeratorApi.listBeers();
    } catch (err) {
      return handleError(err, h);
    }

    return h.response(data).code(200);
  }

  async listKegsHandler(request, h) {
    let data;
    try {
      data = await this.kegeratorApi.listKegs();
    } catch (err) {
      return handleError(err, h);
    }

    return h.response(data).code(200);
  }

  async listClientsHandler(request, h) {
    let data;
    try {
      data = await this.kegeratorApi.listClients();
    } catch (err) {
      return handleError(err, h);
    }

    return h.response(data).code(200);
  }
}

export default HapiServer;

import { SetupTapRequest } from 'services/SetupTapRequest';

class HapiAPI {
  constructor(tapService, beerService, kegService, clientService) {
    this.tapService = tapService;
    this.beerService = beerService;
    this.kegService = kegService;
    this.clientService = clientService;
  }

  async setupTap(tap) {
    const request = new SetupTapRequest(tap.id, tap.clientId, tap.beerId, tap.kegId);
    await this.tapService.setup(request);
  }

  async listBeers() {
    return this.beerService.list();
  }

  async listKegs() {
    return this.kegService.list();
  }

  async listClients() {
    return this.clientService.list();
  }

  async listTaps() {
    return this.tapService.list();
  }
}

export default HapiAPI;

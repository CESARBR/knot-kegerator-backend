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
    await this.tapService.setupTap(request);
  }

  async listBeers() {
    return this.beerService.listBeers();
  }

  async listKegs() {
    return this.kegService.listKegs();
  }

  async listClients() {
    return this.clientService.listClients();
  }

  async listTaps() {
    return this.tapService.listTaps();
  }
}

export default HapiAPI;

import { SetupTapRequest } from 'services/SetupTapRequest';

class HapiAPI {
  constructor(tapService, beerService, kegService) {
    this.tapService = tapService;
    this.beerService = beerService;
    this.kegService = kegService;
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
}

export default HapiAPI;

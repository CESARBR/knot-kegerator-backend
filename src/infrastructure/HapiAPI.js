import { SetupTapRequest } from 'services/SetupTapRequest';

class HapiAPI {
  constructor(tapService, beerService) {
    this.tapService = tapService;
    this.beerService = beerService;
  }

  async setupTap(tap) {
    const request = new SetupTapRequest(tap.id, tap.clientId, tap.beerId, tap.kegId);
    await this.tapService.setup(request);
  }

  async listBeers() {
    return this.beerService.list();
  }
}

export default HapiAPI;

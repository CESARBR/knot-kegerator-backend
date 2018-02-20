import { SetupTapRequest } from 'services/SetupTapRequest';

class HapiAPI {
  constructor(tapService) {
    this.tapService = tapService;
  }

  async setupTap(tap) {
    const request = new SetupTapRequest(tap.id, tap.clientId, tap.beerId, tap.kegId);
    await this.tapService.setupTap(request);
  }
}

export default HapiAPI;

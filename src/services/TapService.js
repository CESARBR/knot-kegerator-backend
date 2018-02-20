import { SetupTapRequestValidator } from './SetupTapRequest';

class TapService {
  constructor(setupTapInteractor) {
    this.setupTapInteractor = setupTapInteractor;
  }

  async setupTap(request) {
    SetupTapRequestValidator.validate(request);
    await this.setupTapInteractor.execute(request);
  }
}

export default TapService;

import { SetupTapRequestValidator } from './SetupTapRequest';

class TapService {
  constructor(setupTapInteractor) {
    this.setupTapInteractor = setupTapInteractor;
  }

  async setup(request) {
    SetupTapRequestValidator.validate(request);
    await this.setupTapInteractor.execute(request);
  }
}

export default TapService;

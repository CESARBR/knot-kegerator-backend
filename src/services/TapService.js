import { SetupTapRequestValidator } from './SetupTapRequest';

class TapService {
  constructor(setupTapInteractor, listTapsInteractor) {
    this.setupTapInteractor = setupTapInteractor;
    this.listTapsInteractor = listTapsInteractor;
  }

  async setupTap(request) {
    SetupTapRequestValidator.validate(request);
    await this.setupTapInteractor.execute(request);
  }

  async listTaps() {
    return this.listTapsInteractor.execute();
  }
}

export default TapService;

import { SetupTapRequestValidator } from './SetupTapRequest';

class TapService {
  constructor(setupTapInteractor, listTapsInteractor) {
    this.setupTapInteractor = setupTapInteractor;
    this.listTapsInteractor = listTapsInteractor;
  }

  async setup(request) {
    SetupTapRequestValidator.validate(request);
    await this.setupTapInteractor.execute(request);
  }

  async list() {
    return this.listTapsInteractor.execute();
  }
}

export default TapService;

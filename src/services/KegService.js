class KegService {
  constructor(listKegsInteractor) {
    this.listKegsInteractor = listKegsInteractor;
  }

  async listKegs() {
    return this.listKegsInteractor.execute();
  }
}

export default KegService;

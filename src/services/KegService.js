class KegService {
  constructor(listKegsInteractor) {
    this.listKegsInteractor = listKegsInteractor;
  }

  async list() {
    return this.listKegsInteractor.execute();
  }
}

export default KegService;

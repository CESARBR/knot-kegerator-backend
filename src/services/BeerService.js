class BeerService {
  constructor(listBeersInteractor) {
    this.listBeersInteractor = listBeersInteractor;
  }

  async list() {
    return this.listBeersInteractor.execute();
  }
}

export default BeerService;

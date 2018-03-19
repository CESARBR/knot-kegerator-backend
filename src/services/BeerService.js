class BeerService {
  constructor(listBeersInteractor) {
    this.listBeersInteractor = listBeersInteractor;
  }

  async listBeers() {
    return this.listBeersInteractor.execute();
  }
}

export default BeerService;

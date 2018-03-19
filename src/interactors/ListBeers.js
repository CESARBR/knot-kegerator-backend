class ListBeers {
  constructor(beerStore) {
    this.beerStore = beerStore;
  }

  async execute() {
    return this.beerStore.getAll();
  }
}

export default ListBeers;

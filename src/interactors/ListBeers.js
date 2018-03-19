class ListBeers {
  constructor(beerStore) {
    this.beerStore = beerStore;
  }

  async execute() {
    return this.beerStore.list();
  }
}

export default ListBeers;

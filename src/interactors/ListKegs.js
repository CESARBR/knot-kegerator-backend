class ListKegs {
  constructor(kegStore) {
    this.kegStore = kegStore;
  }

  async execute() {
    return this.kegStore.getAll();
  }
}

export default ListKegs;

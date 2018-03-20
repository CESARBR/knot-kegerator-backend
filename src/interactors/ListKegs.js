class ListKegs {
  constructor(kegStore) {
    this.kegStore = kegStore;
  }

  async execute() {
    return this.kegStore.list();
  }
}

export default ListKegs;

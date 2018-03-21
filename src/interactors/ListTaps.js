class ListTaps {
  constructor(tapStore) {
    this.tapStore = tapStore;
  }

  async execute() {
    return this.tapStore.getAll();
  }
}

export default ListTaps;

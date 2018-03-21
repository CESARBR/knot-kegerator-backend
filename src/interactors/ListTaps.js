class ListTaps {
  constructor(tapStore) {
    this.tapStore = tapStore;
  }

  async execute() {
    return this.tapStore.list();
  }
}

export default ListTaps;

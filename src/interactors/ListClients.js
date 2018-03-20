class ListClients {
  constructor(clientStore) {
    this.clientStore = clientStore;
  }

  async execute() {
    return this.clientStore.getAll();
  }
}

export default ListClients;

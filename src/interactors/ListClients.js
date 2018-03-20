class ListClients {
  constructor(clientStore) {
    this.clientStore = clientStore;
  }

  async execute() {
    return this.clientStore.list();
  }
}

export default ListClients;

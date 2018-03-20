class ClientService {
  constructor(listClientsInteractor) {
    this.listClientsInteractor = listClientsInteractor;
  }

  async listClients() {
    return this.listClientsInteractor.execute();
  }
}

export default ClientService;

class ClientService {
  constructor(listClientsInteractor) {
    this.listClientsInteractor = listClientsInteractor;
  }

  async list() {
    return this.listClientsInteractor.execute();
  }
}

export default ClientService;

class InvalidStateError extends Error {
  constructor(message, id) {
    super(message);
    this.id = id;
  }
}

export default InvalidStateError;

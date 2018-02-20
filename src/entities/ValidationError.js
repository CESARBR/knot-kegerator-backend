class ValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.details = details;
  }
}

export default ValidationError;

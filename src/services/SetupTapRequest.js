import joi from 'joi';

class SetupTapRequest {
  constructor(id, clientId, beerId, kegId) {
    this.id = id;
    this.clientId = clientId;
    this.beerId = beerId;
    this.kegId = kegId;
  }
}

const setupTapRequestSchema = joi
  .object()
  .keys({
    id: joi
      .string().guid('uuidv4')
      .required(),
    clientId: joi
      .string().guid('uuidv4')
      .required(),
    beerId: joi
      .string().guid('uuidv4')
      .required(),
    kegId: joi
      .string().guid('uuidv4')
      .required(),
  })
  .required();

class SetupTapRequestValidator {
  static validate(setupTapRequest) {
    joi.assert(setupTapRequest, setupTapRequestSchema);
  }
}

export { SetupTapRequest, SetupTapRequestValidator };

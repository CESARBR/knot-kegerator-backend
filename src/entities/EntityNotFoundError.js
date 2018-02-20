class EntityNotFoundError extends Error {
  constructor(entity, id) {
    super(`${entity} entity is not found`);
    this.entity = entity;
    this.id = id;
  }
}

export default EntityNotFoundError;

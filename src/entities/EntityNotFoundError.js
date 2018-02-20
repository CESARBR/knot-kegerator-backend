class EntityNotFoundError extends Error {
  constructor(entity, id) {
    super(`${entity} entity wasn't found`);
    this.entity = entity;
    this.id = id;
  }
}

export default EntityNotFoundError;

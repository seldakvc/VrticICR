function applyJsonIdentity(schema, idField) {
  schema.virtual(idField).get(function getEntityId() {
    return this._id.toString();
  });

  const transform = (document, value) => {
    delete value._id;
    delete value.__v;
    delete value.password;
    return value;
  };

  schema.set("toJSON", { transform, virtuals: true });
  schema.set("toObject", { transform, virtuals: true });
}

export default applyJsonIdentity;

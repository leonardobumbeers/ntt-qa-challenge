type TypeName = 'string' | 'number' | 'boolean' | 'object';
type Schema = Record<string, TypeName>;

export const assertContract = (payload: Record<string, unknown>, schema: Schema): void => {
  expect(payload, 'payload keys').to.have.all.keys(Object.keys(schema));
  Object.entries(schema).forEach(([field, type]) => {
    expect(payload[field], `field "${field}" type`).to.be.a(type);
  });
};

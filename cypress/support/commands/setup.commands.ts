import usersApi from '../api/users.api';
import productsApi from '../api/products.api';
import authApi from '../api/auth.api';
import { buildUser } from '../factories/user.factory';
import { buildProduct } from '../factories/product.factory';
import type { CreatedProduct, CreatedUser, Product, User } from '../types';

Cypress.Commands.add('createUserViaApi', (overrides: Partial<User> = {}) => {
  const user = buildUser(overrides);

  return usersApi.create(user).then(({ status, body }) => {
    expect(status, 'user setup status').to.eq(201);
    return { ...user, _id: body._id } as CreatedUser;
  });
});

Cypress.Commands.add('deleteUserViaApi', (id: string) => usersApi.remove(id));

Cypress.Commands.add('getAuthToken', ({ email, password }: Pick<User, 'email' | 'password'>) =>
  authApi.login({ email, password }).then(({ status, body }) => {
    expect(status, 'auth setup status').to.eq(200);
    return body.authorization as string;
  }),
);

Cypress.Commands.add('createProductViaApi', (overrides: Partial<Product> = {}, token?: string) => {
  const product = buildProduct(overrides);

  return productsApi.create(product, token).then(({ status, body }) => {
    expect(status, 'product setup status').to.eq(201);
    return { ...product, _id: body._id } as CreatedProduct;
  });
});

Cypress.Commands.add('deleteProductViaApi', (id: string, token: string) =>
  productsApi.remove(id, token),
);

import type { CreatedProduct, CreatedUser, Product, User } from './types';

declare global {
  namespace Cypress {
    interface Chainable {
      getByTestId(
        testId: string,
        options?: Partial<Cypress.Loggable & Cypress.Timeoutable>,
      ): Chainable<JQuery<HTMLElement>>;
      findByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
      createUserViaApi(overrides?: Partial<User>): Chainable<CreatedUser>;
      deleteUserViaApi(id: string): Chainable<Cypress.Response<unknown>>;
      getAuthToken(credentials: Pick<User, 'email' | 'password'>): Chainable<string>;
      createProductViaApi(overrides?: Partial<Product>, token?: string): Chainable<CreatedProduct>;
      deleteProductViaApi(id: string, token: string): Chainable<Cypress.Response<unknown>>;
      loginByApi(user: User, targetRoute?: string): Chainable<void>;
      loginViaUi(credentials: Pick<User, 'email' | 'password'>): Chainable<void>;
      submitRegistration(user: User): Chainable<void>;
      submitProductForm(product: Product): Chainable<void>;
      productRowByName(name: string): Chainable<JQuery<HTMLElement>>;
      expectAlert(message: string): Chainable<void>;
    }
  }
}

export {};

import login from '../selectors/login.selectors';
import registration from '../selectors/registration.selectors';
import productForm from '../selectors/product-form.selectors';
import common from '../selectors/common.selectors';
import type { Product, User } from '../types';

Cypress.Commands.add('loginViaUi', ({ email, password }: Pick<User, 'email' | 'password'>) => {
  cy.getByTestId(login.static.email).clear();
  cy.getByTestId(login.static.email).type(email);
  cy.getByTestId(login.static.password).clear();
  cy.getByTestId(login.static.password).type(password, { log: false });
  cy.getByTestId(login.static.submit).click();
});

Cypress.Commands.add('submitRegistration', (user: User) => {
  cy.getByTestId(registration.static.name).clear();
  cy.getByTestId(registration.static.name).type(user.nome);
  cy.getByTestId(registration.static.email).clear();
  cy.getByTestId(registration.static.email).type(user.email);
  cy.getByTestId(registration.static.password).clear();
  cy.getByTestId(registration.static.password).type(user.password, { log: false });
  if (user.administrador === 'true') {
    cy.getByTestId(registration.static.administratorCheckbox).check();
  }
  cy.getByTestId(registration.static.submit).click();
});

Cypress.Commands.add('submitProductForm', (product: Product) => {
  cy.getByTestId(productForm.static.name).clear();
  cy.getByTestId(productForm.static.name).type(product.nome);
  cy.getByTestId(productForm.static.price).clear();
  cy.getByTestId(productForm.static.price).type(String(product.preco));
  cy.getByTestId(productForm.static.description).clear();
  cy.getByTestId(productForm.static.description).type(product.descricao);
  cy.getByTestId(productForm.static.quantity).clear();
  cy.getByTestId(productForm.static.quantity).type(String(product.quantidade));
  cy.getByTestId(productForm.static.submit).click();
});

Cypress.Commands.add('productRowByName', (name: string) => cy.contains('table tbody tr', name));

Cypress.Commands.add('expectAlert', (message: string) => {
  cy.get(common.fallback.alert).should('be.visible').and('contain', message);
});

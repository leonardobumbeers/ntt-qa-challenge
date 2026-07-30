import login from '../../support/selectors/login.selectors';
import type { CreatedUser, Messages } from '../../support/types';

describe('E2E-02: login validation and rejection', () => {
  it('shows required field messages when submitting with no credentials', () => {
    cy.get('@messages').then((messages: unknown) => {
      const { ui } = messages as Messages;
      cy.visit('/login');
      cy.getByTestId(login.static.submit).click();

      cy.expectAlert(ui.requiredEmail);
      cy.expectAlert(ui.requiredPassword);
      cy.location('pathname').should('eq', '/login');
    });
  });

  context('with a registered non-admin user', () => {
    let user: CreatedUser;

    beforeEach(() => {
      cy.createUserViaApi({ administrador: 'false' }).then((created) => {
        user = created;
      });
    });

    afterEach(() => {
      cy.deleteUserViaApi(user._id);
    });

    it('rejects a registered user submitting the wrong password', () => {
      cy.get('@messages').then((messages: unknown) => {
        const { ui } = messages as Messages;
        cy.intercept('POST', '**/login').as('login');

        cy.visit('/login');
        cy.loginViaUi({ email: user.email, password: 'wrong-password' });

        cy.wait('@login').its('response.statusCode').should('eq', 401);
        cy.expectAlert(ui.invalidCredentials);
        cy.location('pathname').should('eq', '/login');
      });
    });

    it('logs a non admin user in and redirects to the shopping home', () => {
      cy.intercept('POST', '**/login').as('login');

      cy.visit('/login');
      cy.loginViaUi({ email: user.email, password: user.password });

      cy.wait('@login').its('response.statusCode').should('eq', 200);
      cy.location('pathname').should('eq', '/home');
    });
  });
});

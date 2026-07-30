import login from '../../support/selectors/login.selectors';
import type { Messages } from '../../support/types';

describe('E2E-02: login validation and rejection', () => {
  let createdUserId: string | null = null;

  afterEach(() => {
    if (createdUserId) {
      cy.deleteUserViaApi(createdUserId);
      createdUserId = null;
    }
  });

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

  it('rejects a registered user submitting the wrong password', () => {
    cy.createUserViaApi().then((user) => {
      createdUserId = user._id;

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
  });

  it('logs a non admin user in and redirects to the shopping home', () => {
    cy.createUserViaApi({ administrador: 'false' }).then((user) => {
      createdUserId = user._id;

      cy.intercept('POST', '**/login').as('login');

      cy.visit('/login');
      cy.loginViaUi({ email: user.email, password: user.password });

      cy.wait('@login').its('response.statusCode').should('eq', 200);
      cy.location('pathname').should('eq', '/home');
    });
  });
});

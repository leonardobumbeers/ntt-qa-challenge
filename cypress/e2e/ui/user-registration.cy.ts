import { buildUser } from '../../support/factories/user.factory';
import adminHome from '../../support/selectors/admin-home.selectors';
import type { Messages } from '../../support/types';

describe('E2E-01: admin registration and redirect', () => {
  let createdUserId: string | null = null;

  afterEach(() => {
    if (createdUserId) {
      cy.deleteUserViaApi(createdUserId);
      createdUserId = null;
    }
  });

  it('registers an administrator and lands on the admin home', () => {
    const user = buildUser({ administrador: 'true' });

    cy.intercept('POST', '**/usuarios').as('registerUser');

    cy.visit('/cadastrarusuarios');
    cy.submitRegistration(user);

    cy.wait('@registerUser').then(({ response }) => {
      expect(response?.statusCode, 'registration status').to.eq(201);
      createdUserId = response?.body._id;
    });

    cy.location('pathname').should('eq', '/admin/home');
    cy.get(adminHome.fallback.welcome).should('contain', user.nome);
  });

  it('keeps a visitor on the registration form when the email is already registered', () => {
    cy.createUserViaApi().then((existingUser) => {
      createdUserId = existingUser._id;

      cy.get('@messages').then((messages: unknown) => {
        const { ui } = messages as Messages;
        cy.visit('/cadastrarusuarios');
        cy.submitRegistration({ ...buildUser(), email: existingUser.email });

        cy.location('pathname').should('eq', '/cadastrarusuarios');
        cy.expectAlert(ui.emailInUse);
      });
    });
  });
});

import authApi from '../../support/api/auth.api';
import type { CreatedUser, Messages } from '../../support/types';

describe('API-02: authentication', () => {
  context('with a registered user', () => {
    let user: CreatedUser;

    beforeEach(() => {
      cy.createUserViaApi().then((created) => {
        user = created;
      });
    });

    afterEach(() => {
      cy.deleteUserViaApi(user._id);
    });

    it('logs in with valid credentials of an api-created user', () => {
      cy.get('@messages').then((messages: unknown) => {
        const { api } = messages as Messages;
        authApi
          .login({ email: user.email, password: user.password })
          .then(({ status, duration, body }) => {
            expect(status, 'login status').to.eq(200);
            expect(duration, 'login duration').to.be.lessThan(3000);
            expect(body.message, 'login message').to.eq(api.loginSuccess);
            expect(body.authorization, 'authorization prefix').to.match(/^Bearer /);
            expect(
              body.authorization.replace('Bearer ', '').split('.'),
              'jwt segments',
            ).to.have.length(3);
          });
      });
    });

    it('rejects a valid email with the wrong password', () => {
      cy.get('@messages').then((messages: unknown) => {
        const { api } = messages as Messages;
        authApi
          .login({ email: user.email, password: 'wrong-password' })
          .then(({ status, duration, body }) => {
            expect(status, 'login status').to.eq(401);
            expect(duration, 'login duration').to.be.lessThan(3000);
            expect(body.message, 'login message').to.eq(api.invalidCredentials);
            expect(body, 'no authorization on rejection').to.not.have.property('authorization');
          });
      });
    });
  });

  it('rejects a login request missing the password field', () => {
    cy.get('@messages').then((messages: unknown) => {
      const { api } = messages as Messages;
      authApi
        .login({ email: 'missing.password@example.com' })
        .then(({ status, duration, body }) => {
          expect(status, 'login status').to.eq(400);
          expect(duration, 'login duration').to.be.lessThan(3000);
          expect(body.password, 'password field validation message').to.eq(api.passwordRequired);
        });
    });
  });
});

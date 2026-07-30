import usersApi from '../../support/api/users.api';
import { buildUser } from '../../support/factories/user.factory';
import { assertContract } from '../../support/utils/contract';
import userSchema from '../../support/schemas/user.schema';
import type { Messages } from '../../support/types';

describe('API-01: user registration lifecycle and contract', () => {
  let userId: string | null = null;

  afterEach(() => {
    if (userId) {
      cy.deleteUserViaApi(userId);
      userId = null;
    }
  });

  it('creates a user with valid unique data', () => {
    const user = buildUser();

    cy.get('@messages').then((messages: unknown) => {
      const { api } = messages as Messages;
      usersApi.create(user).then(({ status, duration, body }) => {
        expect(status, 'registration status').to.eq(201);
        expect(duration, 'registration duration').to.be.lessThan(3000);
        expect(body.message, 'registration message').to.eq(api.created);
        expect(body._id, 'created user id length').to.have.length(16);
        userId = body._id;
      });
    });
  });

  it('retrieves the created user by id with the correct contract', () => {
    cy.createUserViaApi().then((user) => {
      userId = user._id;

      usersApi.getById(user._id).then(({ status, duration, body }) => {
        expect(status, 'get by id status').to.eq(200);
        expect(duration, 'get by id duration').to.be.lessThan(3000);
        expect(body.nome, 'nome').to.eq(user.nome);
        expect(body.email, 'email').to.eq(user.email);
        expect(body.administrador, 'administrador').to.eq('true');
        assertContract(body, userSchema);
      });
    });
  });

  it('rejects registration reusing the same email', () => {
    cy.createUserViaApi().then((user) => {
      userId = user._id;

      cy.get('@messages').then((messages: unknown) => {
        const { api } = messages as Messages;
        const { _id, ...payload } = user;
        usersApi.create({ ...payload, nome: 'Another Name' }).then(({ status, duration, body }) => {
          expect(status, 'duplicate email status').to.eq(400);
          expect(duration, 'duplicate email duration').to.be.lessThan(3000);
          expect(body.message, 'duplicate email message').to.eq(api.emailInUse);
        });
      });
    });
  });

  it('deletes the created user', () => {
    cy.createUserViaApi().then((user) => {
      cy.get('@messages').then((messages: unknown) => {
        const { api } = messages as Messages;
        usersApi.remove(user._id).then(({ status, duration, body }) => {
          expect(status, 'delete status').to.eq(200);
          expect(duration, 'delete duration').to.be.lessThan(3000);
          expect(body.message, 'delete message').to.eq(api.deleted);
        });
      });
    });
  });
});

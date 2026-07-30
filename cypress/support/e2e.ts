import './commands/index';
import type { Messages } from './types';

// Cypress clears the alias store at the start of every test, so a fixture aliased in `before()`
// is only visible to the first `it` in the file — reload it in `beforeEach` instead.
beforeEach(() => {
  cy.fixture<Messages>('messages').as('messages');
});

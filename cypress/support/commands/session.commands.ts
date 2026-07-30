import type { User } from '../types';

Cypress.Commands.add('loginByApi', (user: User, targetRoute: string = '/admin/home') => {
  cy.session(
    ['serverest', user.email],
    () => {
      cy.getAuthToken(user).then((token) => {
        cy.visit('/login');
        cy.window().then((win) => {
          win.localStorage.setItem('serverest/userToken', token);
          win.localStorage.setItem('serverest/userEmail', user.email);
          win.localStorage.setItem('serverest/userNome', user.nome);
          win.localStorage.setItem('serverest/userPassword', user.password);
        });
      });
    },
    {
      validate() {
        cy.window().its('localStorage').invoke('getItem', 'serverest/userToken').should('exist');
      },
      cacheAcrossSpecs: true,
    },
  );
  cy.visit(targetRoute);
});

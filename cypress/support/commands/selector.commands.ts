Cypress.Commands.add('getByTestId', (testId: string, options: Partial<Cypress.Loggable> = {}) =>
  cy.get(`[data-testid="${testId}"]`, options),
);

Cypress.Commands.add(
  'findByTestId',
  { prevSubject: 'element' },
  (subject: JQuery<HTMLElement>, testId: string) =>
    cy.wrap(subject).find(`[data-testid="${testId}"]`),
);

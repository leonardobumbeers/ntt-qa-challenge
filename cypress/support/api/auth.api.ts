import { LOGIN } from './endpoints';

interface RequestOptions {
  method: string;
  url: string;
  body?: Cypress.RequestBody;
}

const request = (options: RequestOptions): Cypress.Chainable<Cypress.Response<any>> =>
  cy.request({
    failOnStatusCode: false,
    ...options,
    url: `${Cypress.env('apiUrl')}${options.url}`,
  });

export default {
  login: (credentials: { email: string; password?: string }) =>
    request({ method: 'POST', url: LOGIN, body: credentials }),
};

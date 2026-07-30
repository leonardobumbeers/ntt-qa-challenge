import { USERS } from './endpoints';
import type { User } from '../types';

interface RequestOptions {
  method: string;
  url: string;
  body?: Cypress.RequestBody;
  qs?: Record<string, string>;
}

const request = (options: RequestOptions): Cypress.Chainable<Cypress.Response<any>> =>
  cy.request({
    failOnStatusCode: false,
    ...options,
    url: `${Cypress.env('apiUrl')}${options.url}`,
  });

export default {
  create: (user: User) => request({ method: 'POST', url: USERS, body: user }),

  getById: (id: string) => request({ method: 'GET', url: `${USERS}/${id}` }),

  list: (params: Record<string, string>) => request({ method: 'GET', url: USERS, qs: params }),

  remove: (id: string) => request({ method: 'DELETE', url: `${USERS}/${id}` }),
};

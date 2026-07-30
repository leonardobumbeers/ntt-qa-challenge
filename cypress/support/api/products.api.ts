import { PRODUCTS } from './endpoints';
import type { Product } from '../types';

interface RequestOptions {
  method: string;
  url: string;
  body?: Cypress.RequestBody;
  qs?: Record<string, string>;
  headers?: Record<string, string>;
}

const request = (options: RequestOptions): Cypress.Chainable<Cypress.Response<any>> =>
  cy.request({
    failOnStatusCode: false,
    ...options,
    url: `${Cypress.env('apiUrl')}${options.url}`,
  });

export default {
  create: (product: Product, token?: string) =>
    request({
      method: 'POST',
      url: PRODUCTS,
      headers: token ? { Authorization: token } : {},
      body: product,
    }),

  getById: (id: string) => request({ method: 'GET', url: `${PRODUCTS}/${id}` }),

  list: (params: Record<string, string>) => request({ method: 'GET', url: PRODUCTS, qs: params }),

  remove: (id: string, token: string) =>
    request({ method: 'DELETE', url: `${PRODUCTS}/${id}`, headers: { Authorization: token } }),
};

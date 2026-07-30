import { buildProduct } from '../../support/factories/product.factory';
import productsApi from '../../support/api/products.api';
import type { CreatedUser, Messages } from '../../support/types';

describe('E2E-03: admin creates a product and finds it in the list', () => {
  let admin: CreatedUser;
  let createdProductId: string | null = null;

  before(() => {
    cy.createUserViaApi({ administrador: 'true' }).then((createdAdmin) => {
      admin = createdAdmin;
    });
  });

  beforeEach(() => {
    cy.loginByApi(admin, '/admin/cadastrarprodutos');
  });

  afterEach(() => {
    if (createdProductId) {
      cy.getAuthToken(admin).then((token) => cy.deleteProductViaApi(createdProductId!, token));
      createdProductId = null;
    }
  });

  after(() => {
    cy.deleteUserViaApi(admin._id);
  });

  it('registers a product and shows it in the product list', () => {
    const product = buildProduct();

    cy.intercept('POST', '**/produtos').as('createProduct');

    cy.submitProductForm(product);

    cy.wait('@createProduct').then(({ response }) => {
      expect(response?.statusCode, 'product creation status').to.eq(201);
      createdProductId = response?.body._id;
    });

    cy.location('pathname').should('eq', '/admin/listarprodutos');
    cy.productRowByName(product.nome)
      .should('contain', String(product.preco))
      .and('contain', String(product.quantidade));
  });

  it('shows a duplicate name alert when submitting an existing product name', () => {
    cy.get('@messages').then((messages: unknown) => {
      const { api } = messages as Messages;

      cy.getAuthToken(admin).then((token) =>
        cy.createProductViaApi({}, token).then((existing) => {
          createdProductId = existing._id;

          cy.visit('/admin/cadastrarprodutos');
          cy.submitProductForm({ ...buildProduct(), nome: existing.nome });

          cy.expectAlert(api.duplicateProduct);

          productsApi.list({ nome: existing.nome }).then(({ body }) => {
            expect(body.quantidade, 'entries with this product name').to.eq(1);
          });
        }),
      );
    });
  });
});

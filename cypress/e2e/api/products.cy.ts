import productsApi from '../../support/api/products.api';
import { buildProduct } from '../../support/factories/product.factory';
import { assertContract } from '../../support/utils/contract';
import productSchema from '../../support/schemas/product.schema';
import type { CreatedProduct, Messages } from '../../support/types';

describe('API-03: product authorization matrix and duplicate handling', () => {
  let adminUserId: string | null = null;
  let adminToken: string;
  let regularUserId: string | null = null;
  let regularToken: string;

  before(() => {
    cy.createUserViaApi({ administrador: 'true' })
      .then((admin) => {
        adminUserId = admin._id;
        return cy.getAuthToken(admin);
      })
      .then((token) => {
        adminToken = token;
      });

    cy.createUserViaApi({ administrador: 'false' })
      .then((regular) => {
        regularUserId = regular._id;
        return cy.getAuthToken(regular);
      })
      .then((token) => {
        regularToken = token;
      });
  });

  after(() => {
    if (adminUserId) cy.deleteUserViaApi(adminUserId);
    if (regularUserId) cy.deleteUserViaApi(regularUserId);
  });

  it('rejects product creation with no Authorization header', () => {
    const product = buildProduct();

    cy.get('@messages').then((messages: unknown) => {
      const { api } = messages as Messages;
      productsApi.create(product, undefined).then(({ status, duration, body }) => {
        expect(status, 'missing token status').to.eq(401);
        expect(duration, 'missing token duration').to.be.lessThan(3000);
        expect(body.message, 'missing token message').to.eq(api.missingToken);
      });
    });
  });

  it('rejects product creation with a non admin token', () => {
    const product = buildProduct();

    cy.get('@messages').then((messages: unknown) => {
      const { api } = messages as Messages;
      productsApi.create(product, regularToken).then(({ status, duration, body }) => {
        expect(status, 'non admin status').to.eq(403);
        expect(duration, 'non admin duration').to.be.lessThan(3000);
        expect(body.message, 'non admin message').to.eq(api.adminOnly);
      });
    });
  });

  context('creation', () => {
    let productId: string;

    afterEach(() => {
      cy.deleteProductViaApi(productId, adminToken);
    });

    it('creates a product with a valid admin token', () => {
      const product = buildProduct();

      cy.get('@messages').then((messages: unknown) => {
        const { api } = messages as Messages;
        productsApi.create(product, adminToken).then(({ status, duration, body }) => {
          expect(status, 'creation status').to.eq(201);
          expect(duration, 'creation duration').to.be.lessThan(3000);
          expect(body.message, 'creation message').to.eq(api.created);
          expect(body._id, 'created product id').to.be.a('string').and.have.length(16);
          productId = body._id;
        });
      });
    });
  });

  context('with an existing product', () => {
    let product: CreatedProduct;

    beforeEach(() => {
      cy.createProductViaApi({}, adminToken).then((created) => {
        product = created;
      });
    });

    afterEach(() => {
      cy.deleteProductViaApi(product._id, adminToken);
    });

    it('retrieves the created product by id with the correct contract', () => {
      productsApi.getById(product._id).then(({ status, duration, body }) => {
        expect(status, 'get by id status').to.eq(200);
        expect(duration, 'get by id duration').to.be.lessThan(3000);
        expect(body.nome, 'nome').to.eq(product.nome);
        expect(body.preco, 'preco').to.eq(product.preco);
        expect(body.descricao, 'descricao').to.eq(product.descricao);
        expect(body.quantidade, 'quantidade').to.eq(product.quantidade);
        assertContract(body, productSchema);
      });
    });

    it('rejects creating a product with a duplicate name', () => {
      cy.get('@messages').then((messages: unknown) => {
        const { api } = messages as Messages;
        const { _id, ...payload } = product;
        productsApi.create(payload, adminToken).then(({ status, duration, body }) => {
          expect(status, 'duplicate name status').to.eq(400);
          expect(duration, 'duplicate name duration').to.be.lessThan(3000);
          expect(body.message, 'duplicate name message').to.eq(api.duplicateProduct);
        });
      });
    });
  });

  it('deletes the created product', () => {
    cy.createProductViaApi({}, adminToken).then((product) => {
      cy.get('@messages').then((messages: unknown) => {
        const { api } = messages as Messages;
        productsApi.remove(product._id, adminToken).then(({ status, duration, body }) => {
          expect(status, 'delete status').to.eq(200);
          expect(duration, 'delete duration').to.be.lessThan(3000);
          expect(body.message, 'delete message').to.eq(api.deleted);
        });
      });
    });
  });
});

import { faker } from '@faker-js/faker';
import type { Product } from '../types';

export const buildProduct = (overrides: Partial<Product> = {}): Product => ({
  nome: `${faker.commerce.productName()} ${faker.string.alphanumeric(6)}`,
  preco: faker.number.int({ min: 10, max: 999 }),
  descricao: faker.commerce.productDescription(),
  quantidade: faker.number.int({ min: 1, max: 100 }),
  ...overrides,
});

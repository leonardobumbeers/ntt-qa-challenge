import { faker } from '@faker-js/faker';
import type { User } from '../types';

// provider is 'example.com', not the spec's original 'serverest.test': the live app's frontend
// email validator rejects the .test TLD with "Email deve ser um email válido" (discovery gate finding).
export const buildUser = (overrides: Partial<User> = {}): User => ({
  nome: faker.person.fullName(),
  email: faker.internet.email({ provider: 'example.com' }).toLowerCase(),
  password: faker.internet.password({ length: 12 }),
  administrador: 'true',
  ...overrides,
});

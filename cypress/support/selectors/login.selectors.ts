import type { SelectorMap } from '../types';

// Verified against the live DOM at https://front.serverest.dev/login (discovery gate, §0).
const loginSelectors: SelectorMap = Object.freeze({
  static: {
    email: 'email',
    password: 'senha',
    submit: 'entrar',
    registerLink: 'cadastrar',
  },
  dynamic: {},
});

export default loginSelectors;

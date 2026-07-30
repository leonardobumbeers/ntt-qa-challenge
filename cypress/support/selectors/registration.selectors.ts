import type { SelectorMap } from '../types';

// Verified against the live DOM at https://front.serverest.dev/cadastrarusuarios (discovery gate, §0).
const registrationSelectors: SelectorMap = Object.freeze({
  static: {
    name: 'nome',
    email: 'email',
    password: 'password',
    administratorCheckbox: 'checkbox',
    submit: 'cadastrar',
    loginLink: 'entrar',
  },
  dynamic: {},
});

export default registrationSelectors;

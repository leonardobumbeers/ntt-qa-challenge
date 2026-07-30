import type { SelectorMap } from '../types';

// Verified against the live DOM at https://front.serverest.dev/admin/cadastrarprodutos (discovery gate, §0).
// "cadastarProdutos" is the real attribute value in the live app (missing the second "r"); it is
// captured verbatim rather than "corrected" to the naming convention.
const productFormSelectors: SelectorMap = Object.freeze({
  static: {
    name: 'nome',
    price: 'preco',
    description: 'descricao',
    quantity: 'quantity',
    image: 'imagem',
    submit: 'cadastarProdutos',
  },
  dynamic: {},
});

export default productFormSelectors;

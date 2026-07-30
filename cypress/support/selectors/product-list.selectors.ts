import type { SelectorMap } from '../types';

// Verified against the live DOM at https://front.serverest.dev/admin/listarprodutos (discovery gate, §0).
// The table carries no data-testid at all (no rows, cells or search field), so this module has no
// static entries to audit. Rows are matched by their rendered text through cy.productRowByName,
// see cypress/support/commands/ui.commands.ts and README "Discovery gate findings".
const productListSelectors: SelectorMap = Object.freeze({
  static: {},
  dynamic: {},
});

export default productListSelectors;

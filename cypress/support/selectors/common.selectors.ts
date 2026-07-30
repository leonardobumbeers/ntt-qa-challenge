interface CommonSelectorMap {
  fallback: Record<string, string>;
}

// Alert containers across every page (/login, /cadastrarusuarios, /admin/cadastrarprodutos) carry
// no data-testid in the live DOM. role="alert" is the single, centrally defined fallback selector,
// used only by cy.expectAlert. See README "Discovery gate findings".
const commonSelectors: CommonSelectorMap = Object.freeze({
  fallback: {
    alert: '[role="alert"]',
  },
});

export default commonSelectors;

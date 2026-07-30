import type { SelectorMap } from '../types';

interface AdminHomeSelectorMap extends SelectorMap {
  fallback: Record<string, string>;
}

// Verified against the live DOM at https://front.serverest.dev/admin/home (discovery gate, §0).
// The welcome heading has no data-testid in the live DOM; it is the page's only <h1>, so it is
// referenced as a documented fallback (see README "Discovery gate findings").
const adminHomeSelectors: AdminHomeSelectorMap = Object.freeze({
  static: {
    home: 'home',
    registerUsersLink: 'cadastrar-usuarios',
    listUsersLink: 'listar-usuarios',
    registerProductsLink: 'cadastrar-produtos',
    listProductsLink: 'listar-produtos',
    reportsLink: 'link-relatorios',
    logout: 'logout',
  },
  dynamic: {},
  fallback: {
    welcome: 'h1',
  },
});

export default adminHomeSelectors;

import login from '../../support/selectors/login.selectors';
import registration from '../../support/selectors/registration.selectors';
import adminHome from '../../support/selectors/admin-home.selectors';
import productForm from '../../support/selectors/product-form.selectors';

const auditPage = (label: string, route: string, selectors: Record<string, string>) => {
  cy.log(`auditing: ${label}`);
  cy.visit(route);
  Object.entries(selectors).forEach(([name, testId]) => {
    cy.getByTestId(testId)
      .should('exist')
      .then(() => cy.log(`ok: ${label}.${name} -> ${testId}`));
  });
};

describe('Selector audit', () => {
  it('resolves every selector registered for the public pages', () => {
    auditPage('login', '/login', login.static);
    auditPage('registration', '/cadastrarusuarios', registration.static);
  });

  it('resolves every selector registered for the admin pages', () => {
    cy.createUserViaApi({ administrador: 'true' }).then((admin) => {
      cy.loginByApi(admin);
      auditPage('adminHome', '/admin/home', adminHome.static);
      auditPage('productForm', '/admin/cadastrarprodutos', productForm.static);
      cy.deleteUserViaApi(admin._id);
    });
  });
});

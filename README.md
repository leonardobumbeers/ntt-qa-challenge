# ServeRest Cypress Challenge

Automated end-to-end and API test suite for [ServeRest](https://serverest.dev), a public REST API
and companion frontend built for practicing test automation. This project exercises the frontend at
[https://front.serverest.dev](https://front.serverest.dev) with three E2E scenarios (user
registration, login, product management) and the API at [https://serverest.dev](https://serverest.dev)
with three scenarios (users, authentication, products), using native Cypress resources end to end.
Written in TypeScript throughout, including a global `Cypress.Chainable` augmentation for every
custom command (`cypress/support/index.d.ts`), so specs and commands get full autocomplete and
type-checking rather than untyped `any` chains.

<!-- Update the org/repo path below once this project is pushed to its GitHub remote. -->

[![CI](https://github.com/<github-user>/ntt-qa-challenge/actions/workflows/ci.yml/badge.svg)](https://github.com/<github-user>/ntt-qa-challenge/actions/workflows/ci.yml)
![Cypress](https://img.shields.io/badge/cypress-14-04C38E?logo=cypress)
![ServeRest](https://img.shields.io/badge/tested%20on-serverest.dev-orange)

## Prerequisites

- Node.js version pinned in `.nvmrc` (`nvm use`)
- npm

## Install and run

```bash
npm install
npm run cy:open          # interactive runner
npm run test              # everything, headless
npm run test:api          # API specs only
npm run test:ui           # UI specs only
npm run audit:selectors   # discovery gate, outside CI and outside specPattern
npm run lint
npm run format
npm run typecheck         # tsc --noEmit
```

## Project structure

```
cypress/
├── e2e/
│   ├── api/          # 3 API-behaviour specs (API-01..03), drive the service clients only
│   ├── discovery/    # the §0 gate audit spec, excluded from specPattern and CI
│   └── ui/           # 3 E2E specs (E2E-01..03)
├── fixtures/
│   └── messages.json # every expected application string, single source of truth
└── support/
    ├── api/          # Service Client, one module per resource (users, auth, products)
    ├── commands/     # the whole interaction layer: selector/setup/session/ui commands
    ├── factories/     # faker-backed builders for users and products
    ├── schemas/       # plain field->type maps for contract assertions
    ├── selectors/     # frozen data maps of logical name -> data-testid, no behaviour
    ├── utils/         # assertContract, a plain function, not a command
    ├── types.ts       # shared TS interfaces (User, Product, Messages)
    └── e2e.ts         # support entrypoint, loads commands and the messages fixture
```

Dependency direction is one way: specs depend on commands, commands depend on selectors and the API
clients, API clients depend on endpoints, and factories/schemas are leaves. Nothing imports upward.

## Architecture and design decisions

**Application Actions via the API.** Bahmutov's app-actions pattern reaches into the app's own model
through `window`; ServeRest's frontend is third-party, so its API is the equivalent leverage point.
`cy.createUserViaApi`, `cy.createProductViaApi` and `cy.getAuthToken` (`support/commands/setup.commands.ts`)
build state for a test without driving the UI, except in the one scenario per feature where the UI
flow itself is what's under test.

**Custom commands as the interaction layer.** `cy.loginViaUi`, `cy.submitRegistration`,
`cy.submitProductForm`, `cy.productRowByName` and `cy.expectAlert` replace Page Objects. Each does one
thing a user could name, never asserts a business outcome (except `cy.expectAlert`, whose name says
otherwise), and never calls `cy.visit` — navigation stays visible in the spec.

**Selector modules as data.** Each page's `data-testid` values live in a single frozen object, split
into `static` (present on load, covered by the audit) and `dynamic`. No class, no method, no `this`.

**Service clients per resource.** `support/api/*.api.ts` own their route, headers and payload shape,
and return the Cypress chainable so specs assert on the response directly. `failOnStatusCode: false`
lives inside the client so 400/401/403 cases read as assertions, not exceptions.

**Faker-backed factories.** `buildUser` and `buildProduct` generate unique data per run with
overridable defaults, which is what makes reruns against a shared, daily-reset environment safe.

**Dependency-free contract assertions.** `assertContract` (`support/utils/contract.ts`) is a schema of
field name to JS type and nothing else — no `ajv`, no schema library. It is a plain function, not a
command, because it performs no Cypress action.

**`cy.session` caching.** `cy.loginByApi` wraps `cy.session`, keyed by user email, with a `validate`
callback that checks the session token is still in `localStorage`, and `cacheAcrossSpecs: true` so the
suite doesn't re-authenticate per file.

**`cy.intercept` for network-level assertions.** Every UI scenario that submits a form pairs the
UI-visible outcome with an assertion on the intercepted request's status code, which is what proves
the UI actually talked to the API instead of only looking right.

**Retries only in run mode.** `cypress.config.ts` sets `retries: { runMode: 2, openMode: 0 }` so local
failures during development stay visible immediately, while CI absorbs the shared environment's
occasional network flakiness. Timeouts are raised above the Cypress defaults for the same reason.
Video recording is off to keep the repository light; screenshots on failure stay on.

## Why not Page Objects

The brief explicitly asks to maximize native Cypress resources, and custom commands, `cy.session`,
`cy.intercept` and `cy.fixture` already are Cypress's own reuse mechanisms — a class hierarchy on top
of them is a second, parallel abstraction. Gleb Bahmutov's "Stop using Page Objects and Start using
App Actions" (Cypress blog, January 2019) makes the case that dispatching actions straight to the app
beats wrapping the DOM in objects; the Cypress team later softened that framing, and the honest,
current read is that POM is not an anti-pattern in Cypress, it's just not the idiomatic first choice
here. Page Objects that `return this` also fight Cypress's own chainable/retry model, and Command Log
entries are readable by command name in a CI artifact in a way Page Object method calls are not. What
POM actually buys — one place per selector — is delivered here by the `support/selectors/` modules at
a fraction of the code and none of the class ceremony.

## Discovery gate findings (§0)

The live DOM did not match every assumption in the original spec. Recorded here rather than silently
"corrected" to the naming convention:

- Alert containers on `/login`, `/cadastrarusuarios` and `/admin/cadastrarprodutos` carry **no**
  `data-testid`. The one stable hook is `role="alert"`, defined once in
  `support/selectors/common.selectors.ts` and used only by `cy.expectAlert`.
- The `/admin/home` welcome heading has no `data-testid` either; it is the page's only `<h1>`, used as
  a documented fallback in `support/selectors/admin-home.selectors.ts`.
- The product list table at `/admin/listarprodutos` has **zero** `data-testid` attributes — no rows,
  cells, or search field. Rows are matched by rendered text via `cy.contains` in `cy.productRowByName`.
- The product form's submit button testid is `cadastarProdutos` in the live app (missing the second
  "r"), captured verbatim rather than "fixed."
- The session key the frontend reads after a UI login is `localStorage['serverest/userToken']`, and
  its value already includes the `Bearer ` prefix — this matched the spec's original assumption.
- The frontend's email validator rejects the `.test` TLD ("Email deve ser um email válido"), so the
  user factory generates `@example.com` addresses instead of `@serverest.test`.
- Typing into React-controlled inputs too fast (a raw `value` set, or an instant fill without
  per-character events) desyncs the form's validation state and produces false "obrigatório" errors on
  fields that were actually filled. `cy.type()`'s default per-character dispatch avoids this; it is
  called out here because it cost real debugging time during discovery.

## Scenario coverage

| ID        | Layer | Scenario                                                                                       | File                                         |
| --------- | ----- | ---------------------------------------------------------------------------------------------- | -------------------------------------------- |
| E2E-01    | UI    | Admin registration redirects to `/admin/home`; duplicate email is rejected                     | `cypress/e2e/ui/user-registration.cy.ts`     |
| E2E-02    | UI    | Empty-form validation, wrong-password rejection, non-admin redirect to `/home`                 | `cypress/e2e/ui/login.cy.ts`                 |
| E2E-03    | UI    | Admin creates a product via the form and finds it in the list; duplicate name is rejected      | `cypress/e2e/ui/product-management.cy.ts`    |
| API-01    | API   | User registration lifecycle, duplicate email, contract, delete                                 | `cypress/e2e/api/users.cy.ts`                |
| API-02    | API   | Login success, wrong password, missing password field                                          | `cypress/e2e/api/auth.cy.ts`                 |
| API-03    | API   | Product authorization matrix (missing/non-admin/admin token), contract, duplicate name, delete | `cypress/e2e/api/products.cy.ts`             |
| Discovery | Gate  | Every registered selector resolves against the live DOM                                        | `cypress/e2e/discovery/selector-audit.cy.ts` |

## Trade-offs and what I would add next

- **Visual regression** — not attempted; the shared environment's daily data reset and other users'
  concurrent traffic would make screenshot diffs noisy.
- **`cypress-axe` accessibility checks** — left out to keep the dependency count at the one the brief
  allows (`@faker-js/faker`); would be the first addition given more time.
- **Contract testing against the live Swagger document** — `assertContract` checks shape by hand;
  generating it from `https://serverest.dev/` swagger JSON would remove the manual schema maintenance.
- **A load profile against a local ServeRest instance** — not safe to run against the shared public
  environment.
- **Allure or Mochawesome reporting** — skipped to stay dependency-light; either would improve the CI
  artifact readability.

## Data policy

The public ServeRest instance resets its data daily and is shared with everyone else running this
suite. Every test creates the data it needs through the API and deletes it in `afterEach`/`after`, so
the suite leaves nothing behind and never depends on another user's records.

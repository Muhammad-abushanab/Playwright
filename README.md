# Client Dashboard – Playwright E2E Automation Framework

![Playwright](https://img.shields.io/badge/Playwright-1.65-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js&logoColor=white)
![Faker](https://img.shields.io/badge/Test%20Data-Faker-blueviolet)

End-to-end UI test automation framework for the **"Let's Shop" client dashboard**, an Angular e-commerce web app.
Built with **Playwright + TypeScript** using the **Page Object Model** and a **test data factory** for
fully dynamic, repeatable test runs.

> 🚧 **Status:** Active development. The framework is in its initial phase, and coverage currently focuses on the
> user registration flow. See the [Roadmap](#-roadmap) for what's next.

---

## ✨ Highlights

- **Page Object Model (POM)**: one class per screen (`LoginPage`, `RegisterPage`), keeping locators and actions out of the tests.
- **Page-to-page navigation**: `loginPage.goToRegister()` returns a `RegisterPage`, so tests read like the user journey.
- **Test data factory**: `createUser(overrides?)` generates a unique user for every test with Faker, using TypeScript `Partial<T>` overrides for edge cases.
- **Resilient locators**: user-facing locators (`getByRole`, `getByPlaceholder`) with `exact` matching. Stable `id` fallbacks are used, with a comment, only where the app's labels aren't linked to their inputs.
- **Positive and negative coverage**: a valid registration plus validation and error cases.
- **Web-first assertions**: auto-retrying `expect(...)` assertions, with no hard waits or `sleep`s.
- **Environment-based configuration**: the target URL is loaded from `.env`, so nothing environment-specific is hardcoded.
- **HTML reporting and traces**: the built-in Playwright HTML report, with traces captured on retry.

---

## 🧰 Tech Stack

| Area            | Tool                                   |
|-----------------|----------------------------------------|
| Test runner     | [Playwright Test](https://playwright.dev) |
| Language        | TypeScript                             |
| Test data       | [@faker-js/faker](https://fakerjs.dev) |
| Configuration   | dotenv                                 |
| Reporting       | Playwright HTML Reporter               |
| CI (scaffolded) | GitHub Actions                         |

---

## 📁 Project Structure

```
ClientDashboard/
├── Pages/                          # Page Object Model classes
│   ├── LoginPage.ts                #   Login screen + navigation to Register
│   └── RegisterPage.ts             #   Registration form + RegisterDetails type
├── tests/
│   └── RegisterTestCases.spec.ts   # Registration test suite
├── test-data/
│   └── userFactory.ts              # createUser() test data factory (Faker)
├── helpers/
│   └── getRandomRegisteredUser.ts  # Reads previously registered users
├── playwright.config.ts            # Runner, browser and reporter configuration
└── .env                            # Environment variables (not committed)
```

---

## 🧪 Test Coverage

**Feature: User Registration**

| # | Scenario                                  | Type     |
|---|-------------------------------------------|----------|
| 1 | Register a new user with valid data       | Positive |
| 2 | Register with an already-registered email | Negative |
| 3 | Register with mismatched passwords        | Negative |
| 4 | Register with an invalid email format     | Negative |
| 5 | Register with empty required fields       | Negative |
| 6 | Register with an invalid phone number     | Negative |
| 7 | Register with an invalid password format  | Negative |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- npm

### Installation

```bash
git clone <repo-url>
cd ClientDashboard
npm ci
npx playwright install --with-deps chromium
```

### Configuration

Create a `.env` file in the project root:

```env
URL=<application-under-test-url>
```

### Running the Tests

```bash
# Run all tests (headless)
npx playwright test

# Run with the browser visible
npx playwright test --headed

# Debug step by step with the Playwright Inspector
npx playwright test --debug

# Interactive UI mode
npx playwright test --ui

# Run a single test by name
npx playwright test -g "mismatched passwords"

# Open the last HTML report
npx playwright show-report
```

---

## 🏗️ Design Decisions

**Page Object Model, one class per screen.**
Login and Register are separate routes (`#/auth/login`, `#/auth/register`), so each has its own page object.
This avoids locator name clashes, since both screens have an email, a password and a submit button.

**A test data factory instead of static fixtures.**
Hardcoded users break on the second run ("user already exists"). `createUser()` builds a unique user per call.
Values that don't affect behaviour, such as names, email and phone, are random. Values that select a code path,
such as occupation and gender, are fixed by default, so a failure is reproducible rather than random.
Each test overrides only what it is testing:

```ts
const user = createUser({ confirmPassword: 'DifferentPassword123!' });
```

**A locator strategy built on accessibility first.**
Locators follow Playwright's recommended priority: role, then label, then placeholder, then test id or `id`.
Name matching uses `exact: true`, because Playwright's default substring matching caused
`name: 'Password'` to resolve to the *Confirm Password* field.

---

## 🗺️ Roadmap

- [ ] Login and Forgot Password test suites
- [ ] Custom Playwright fixtures to inject page objects into tests
- [ ] `baseURL` in the config and `beforeEach` hooks for shared setup
- [ ] Self-contained test data (no dependency on earlier runs)
- [ ] Run in CI with GitHub Actions, with the URL stored as a secret
- [ ] Cross-browser projects (Firefox, WebKit)
- [ ] API-level setup to speed up the UI tests
- [ ] ESLint (`eslint-plugin-playwright`) and Prettier

---

## 👤 Author

**Muhammad Abushanab**, QA Automation Engineer

- GitHub: [@Muhammad-abushanab](https://github.com/Muhammad-abushanab)
- LinkedIn: _add your profile link_

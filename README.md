# Playwright Test Automation Portfolio

![Playwright](https://img.shields.io/badge/Playwright-1.6x-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js&logoColor=white)
![Faker](https://img.shields.io/badge/Test%20Data-Faker-blueviolet)
![GitHub Actions](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)

A collection of **end-to-end test automation frameworks** built with **Playwright and TypeScript**.
Each framework targets a different web application and shows a different set of automation techniques,
from UI Page Object design to API authentication, session reuse and dynamic test data.

| Framework | Application under test | Focus | Tests |
|-----------|------------------------|-------|:-----:|
| [**EventHub**](#-eventhub--event-management--ticket-booking) | Event management and ticket booking platform | Full E2E business flows, API + UI, session reuse | 9 |
| [**ClientDashboard**](#-clientdashboard--e-commerce-user-registration) | "Let's Shop" Angular e-commerce dashboard | Form validation, dynamic test data, negative testing | 7 |

> 🚧 **Status:** Active development. EventHub is the more mature framework, and ClientDashboard is in its initial phase.

---

## 🧠 Skills Demonstrated

| Technique | EventHub | ClientDashboard |
|-----------|:--------:|:---------------:|
| Page Object Model, organised by feature | ✅ | ✅ |
| Accessible, user-facing locators (`getByRole`, `getByLabel`, `getByTestId`) | ✅ | ✅ |
| Locator chaining and filtering (`filter({ hasText })`, `.or()`) | ✅ | |
| Web-first and polling assertions (`expect.poll`, `toBeInViewport`) | ✅ | ✅ |
| **API testing**: login via `request` context and JWT validation | ✅ | |
| **Auth token injection** into `localStorage` (`addInitScript`) to skip UI login | ✅ | |
| **Session reuse** with `storageState` | ✅ | |
| Full E2E business flow across multiple pages | ✅ | |
| Data-consistency checks (seat count, price, booking reference) | ✅ | |
| **Test data factory** with Faker and TypeScript `Partial<T>` overrides | | ✅ |
| Positive and negative / validation testing | ✅ | ✅ |
| Environment config (`.env` / config module) | ✅ | ✅ |
| HTML reporting, traces, GitHub Actions workflow | ✅ | ✅ |

---

## 📁 Repository Structure

```
Playwright/
├── EventHub/                  # Event management & booking framework
│   ├── Pages/                 #   Page objects grouped by feature
│   │   ├── Events/            #     Events list, New Event, Manage Events, Book Tickets
│   │   ├── Home/              #     Navigation and Admin menu
│   │   ├── Login/
│   │   └── Mybookings/
│   ├── tests/                 #   login, booking, API and session-storage specs
│   ├── config/                #   Environment configuration
│   └── playwright.config.ts
│
├── ClientDashboard/           # E-commerce registration framework
│   ├── Pages/                 #   LoginPage, RegisterPage
│   ├── tests/                 #   Registration specs
│   ├── test-data/             #   createUser() factory
│   ├── helpers/               #   Test data helpers
│   └── playwright.config.ts
│
└── Utils/                     # Shared artifacts (e.g. saved auth storage state)
```

Each framework is an **independent Playwright project** with its own `package.json` and config,
so they can be installed and run separately.

---

## 🎟️ EventHub – Event Management & Ticket Booking

An admin-facing event platform where users create events, book tickets and manage bookings.
The suite covers **complete business flows** and mixes **UI and API** techniques.

### Highlights

- **End-to-end admin journey**: create an event, find it through search, book tickets, then confirm that
  the available seats dropped by the right amount and that the booking reference appears in *My Bookings*.
- **API authentication**: logs in through the REST API in `beforeAll`, checks that the response is a valid JWT,
  then injects the token into `localStorage` with `page.addInitScript`, which skips the UI login entirely.
- **Session reuse**: authenticates once, saves the session with `context.storageState()` and starts
  later tests already logged in.
- **Robust locators**: `getByTestId`, plus row and card filtering such as
  `eventRows.filter({ hasText: title }).getByTestId('delete-event-btn')`, to act on one specific item in a list.
- **Handles async UI updates** with `expect.poll()` instead of hard waits.
- **Unique test data**: event titles include a timestamp, so runs never collide.

### Test Coverage

| Spec | Scenario |
|------|----------|
| `login.spec.ts` | Login with valid credentials |
| | Login with invalid credentials (error message) |
| | Login with empty credentials (validation) |
| `booking.spec.ts` | Admin creates an event and books tickets (full E2E with seat and price checks) |
| | Admin cancels an existing booking |
| | Admin deletes an event from *Manage Events* |
| | Admin views booking details and checks refund eligibility |
| `apiTest.spec.ts` | API login, JWT validation and token injection into `localStorage` |
| `sessionStorage.spec.ts` | Reuses a saved `storageState` session to run the E2E booking flow |

---

## 🛒 ClientDashboard – E-commerce User Registration

The registration flow of an Angular e-commerce dashboard, with a focus on
**form validation**, **negative testing** and **dynamic, repeatable test data**.

### Highlights

- **One page object per screen**: Login and Register are separate routes, so each has its own class.
  `loginPage.goToRegister()` returns a `RegisterPage`, so tests read like the user journey.
- **Test data factory**: `createUser(overrides?)` builds a unique user with Faker on every call.
  Each test overrides only the field it is testing:
  ```ts
  const user = createUser({ confirmPassword: 'DifferentPassword123!' });
  ```
- **Deliberate randomness**: values that don't affect behaviour (names, email, phone) are random.
  Values that pick a code path (occupation, gender) are fixed, so failures are reproducible.
- **Resilient locators**: `exact: true` name matching, with documented `id` fallbacks where the
  application's labels aren't linked to their inputs.

### Test Coverage

| # | Scenario | Type |
|---|----------|------|
| 1 | Register a new user with valid data | Positive |
| 2 | Register with an already-registered email | Negative |
| 3 | Register with mismatched passwords | Negative |
| 4 | Register with an invalid email format | Negative |
| 5 | Register with empty required fields | Negative |
| 6 | Register with an invalid phone number | Negative |
| 7 | Register with an invalid password format | Negative |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- npm

### Install and run a framework

Each framework is installed and run from its own folder:

```bash
git clone <repo-url>
cd Playwright/EventHub          # or: cd Playwright/ClientDashboard
npm ci
npx playwright install --with-deps chromium
```

### Configuration

| Framework | Where to configure |
|-----------|--------------------|
| EventHub | `config/config.ts`: application URL, API URL and test account |
| ClientDashboard | `.env` file in the project folder, containing `URL=<application-under-test-url>` |

### Useful commands

```bash
npx playwright test                    # run all tests (headless)
npx playwright test --headed           # run with the browser visible
npx playwright test --ui               # interactive UI mode
npx playwright test --debug            # step through with the Playwright Inspector
npx playwright test tests/login.spec.ts   # run one spec file
npx playwright test -g "refund"        # run tests whose name matches
npx playwright show-report             # open the last HTML report
```

---

## 🏗️ Design Principles

- **Tests describe behaviour; page objects hold the details.** Specs read like user stories, and all
  locators and interactions live in page classes.
- **Prefer what the user sees.** Locators follow Playwright's priority order: role, then label,
  then placeholder, then test id. CSS selectors are a documented last resort.
- **No hard waits.** Synchronisation relies on auto-waiting actions, web-first assertions and `expect.poll`.
- **Every run is independent.** Generated data (timestamps, Faker) means tests can run again and again without cleanup.
- **Use the API to set things up, the UI to verify.** Logging in through the API or reusing a stored session
  keeps UI tests focused on what they check, and makes them faster.

---

## 🗺️ Roadmap

- [ ] Custom Playwright fixtures to inject page objects and authenticated sessions
- [ ] `baseURL` in each config and shared `beforeEach` setup
- [ ] Move credentials and URLs to environment variables and CI secrets
- [ ] Root-level GitHub Actions workflow running both frameworks
- [ ] Cross-browser projects (Firefox, WebKit) and mobile viewports
- [ ] ClientDashboard: Login and Forgot Password suites, self-contained test data
- [ ] ESLint (`eslint-plugin-playwright`) and Prettier across the repository

---

## 👤 Author

**Muhammad Abushanab**, QA Automation Engineer

- GitHub: [@Muhammad-abushanab](https://github.com/Muhammad-abushanab)
- LinkedIn: _add your profile link_

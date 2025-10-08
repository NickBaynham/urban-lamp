# urban-lamp

A TypeScript Playwright testing project for end-to-end testing.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Setup

### Quick Setup with Make

Run the complete setup with a single command:
```bash
make setup
```

This will install all dependencies and Playwright browsers.

### Manual Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Using Make

```bash
make test              # Run all tests
make test-headed       # Run tests with visible browser
make test-ui           # Run tests in interactive UI mode
make test-debug        # Run tests in debug mode
make test-report       # View HTML test report
make codegen           # Generate tests using Codegen
make clean             # Remove node_modules and generated files
make help              # Show all available commands
```

### Using npm

```bash
npm test                # Run all tests
npm run test:headed     # Run tests with visible browser
npm run test:ui         # Run tests in interactive UI mode
npm run test:debug      # Run tests in debug mode
npm run test:report     # View HTML test report
npm run test:codegen    # Generate tests using Codegen
```

## Project Structure

```
urban-lamp/
├── tests/                    # Test files
│   └── example.spec.ts      # Example test suite
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies
```

## Configuration

The project is configured to run tests on three browsers:
- Chromium
- Firefox
- WebKit (Safari)

You can modify `playwright.config.ts` to customize:
- Test directory
- Number of workers
- Retry strategy
- Reporter options
- Base URL
- And much more

## Writing Tests

Tests are located in the `tests/` directory. Example test structure:

```typescript
import { test, expect } from '@playwright/test';

test('my test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});
```

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright TypeScript Guide](https://playwright.dev/docs/test-typescript)
- [Best Practices](https://playwright.dev/docs/best-practices)
Playwright TypeScript data-driven test template

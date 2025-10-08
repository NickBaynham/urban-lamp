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
├── data/                           # Test data files
│   └── validation-rules.csv       # Sample CSV data for data-driven tests
├── tests/                          # Test files
│   ├── example.spec.ts            # Example test suite
│   ├── data-driven.spec.ts        # Data-driven tests with filtering/transformation
│   └── data-driven-cli.spec.ts    # CLI parameter driven tests
├── utils/                          # Utility functions
│   ├── csvDataLoader.ts           # CSV data loader with filtering/transformation
│   └── dataDrivenTest.ts          # Data-driven test framework
├── playwright.config.ts           # Playwright configuration
├── tsconfig.json                  # TypeScript configuration
├── Makefile                       # Make commands for easy task execution
└── package.json                   # Project dependencies
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

## Data-Driven Testing

This project includes a powerful data-driven testing framework that allows you to run the same test with different data sets.

### Features

- **CSV Support**: Load test data from CSV files
- **Command-Line Parameters**: Run tests with CLI arguments
- **Data Filtering**: Filter test data based on criteria
- **Data Transformation**: Transform data before running tests
- **Flexible Configuration**: Mix and match options as needed

### CSV File Format

Create a CSV file in the `data/` directory with columns: `story`, `rule`, `min`, `max`

```csv
story,rule,min,max
User Registration,Username length validation,3,20
User Registration,Password strength validation,8,128
Product Catalog,Price range validation,0.01,99999.99
```

### Basic Usage

```typescript
import { runDataDrivenTest } from '../utils/dataDrivenTest';

runDataDrivenTest(
  {
    dataSource: {
      csvPath: './data/validation-rules.csv',
    },
    testName: 'Validation Rule Test'
  },
  (testData) => async ({ page }) => {
    console.log(`Testing: ${testData.story} - ${testData.rule}`);
    console.log(`Min: ${testData.min}, Max: ${testData.max}`);
    
    // Your test logic here
    const minValue = parseFloat(testData.min);
    const maxValue = parseFloat(testData.max);
    expect(minValue).toBeLessThan(maxValue);
  }
);
```

### Filtered Tests

Filter rows based on specific criteria:

```typescript
runDataDrivenTest(
  {
    dataSource: {
      csvPath: './data/validation-rules.csv',
      filters: [
        { field: 'story', value: 'User Registration', operator: 'equals' }
      ]
    },
    testName: 'User Registration Only'
  },
  (testData) => async ({ page }) => {
    // Only runs for "User Registration" rows
  }
);
```

**Available operators**: `equals`, `contains`, `greaterThan`, `lessThan`

### Transformed Tests

Transform data before running tests:

```typescript
runDataDrivenTest(
  {
    dataSource: {
      csvPath: './data/validation-rules.csv',
      transforms: [
        {
          field: 'min',
          transform: (value) => parseInt(value) * 2
        },
        {
          field: 'rule',
          transform: (value) => value.toUpperCase()
        }
      ]
    },
    testName: 'Transformed Data Test'
  },
  (testData) => async ({ page }) => {
    // testData.min is now doubled
    // testData.rule is now uppercase
  }
);
```

### Command-Line Parameters

Run a single test with command-line parameters:

```bash
# Using npm
npx playwright test data-driven-cli.spec.ts -- --story="My Story" --rule="My Rule" --min=5 --max=100

# Using Make
make test-data-cli STORY="My Story" RULE="My Rule" MIN=5 MAX=100
```

### Running Data-Driven Tests

```bash
# Run all data-driven tests
make test-data

# Run filtered data-driven tests
make test-data-filtered

# Run with command-line parameters
make test-data-cli STORY="User Login" RULE="Password Validation" MIN=8 MAX=128

# Or use npm directly
npm test data-driven.spec.ts
```

### Example: Real-World Test

```typescript
runDataDrivenTest(
  {
    dataSource: {
      csvPath: './data/validation-rules.csv',
      filters: [{ field: 'story', value: 'User Registration' }]
    }
  },
  async (testData, { page }) => {
    await page.goto('https://example.com/register');
    
    // Test minimum length validation
    await page.fill('#username', 'a'.repeat(parseInt(testData.min) - 1));
    await page.click('#submit');
    await expect(page.locator('.error')).toBeVisible();
    
    // Test maximum length validation
    await page.fill('#username', 'a'.repeat(parseInt(testData.max) + 1));
    await page.click('#submit');
    await expect(page.locator('.error')).toBeVisible();
    
    // Test valid input
    await page.fill('#username', 'a'.repeat(parseInt(testData.min)));
    await page.click('#submit');
    await expect(page.locator('.success')).toBeVisible();
  }
);
```

## Additional Documentation

- [Data-Driven Testing Guide](./DATA_DRIVEN_TESTING.md) - Comprehensive guide for data-driven testing

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright TypeScript Guide](https://playwright.dev/docs/test-typescript)
- [Best Practices](https://playwright.dev/docs/best-practices)
Playwright TypeScript data-driven test template

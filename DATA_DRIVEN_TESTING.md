# Data-Driven Testing Guide

This guide provides comprehensive documentation for using the data-driven testing framework.

## Quick Start

### 1. Create a CSV File

Create a CSV file in the `data/` directory with your test data:

```csv
story,rule,min,max
User Registration,Username length validation,3,20
User Registration,Password strength validation,8,128
```

### 2. Write Your Test

```typescript
import { runDataDrivenTest } from '../utils/dataDrivenTest';

runDataDrivenTest(
  {
    dataSource: { csvPath: './data/validation-rules.csv' },
    testName: 'My Test'
  },
  async (testData, { page }) => {
    // Your test logic using testData.story, testData.rule, etc.
  }
);
```

### 3. Run Your Test

```bash
make test-data
```

## Advanced Features

### Filtering Data

Run tests only for specific rows:

```typescript
dataSource: {
  csvPath: './data/validation-rules.csv',
  filters: [
    { field: 'story', value: 'User Registration', operator: 'equals' }
  ]
}
```

**Available Operators:**
- `equals` - Exact match
- `contains` - Substring match
- `greaterThan` - Numeric comparison
- `lessThan` - Numeric comparison

### Transforming Data

Modify data before running tests:

```typescript
dataSource: {
  csvPath: './data/validation-rules.csv',
  transforms: [
    { field: 'min', transform: (value) => parseInt(value) * 2 },
    { field: 'rule', transform: (value) => value.toUpperCase() }
  ]
}
```

### Command-Line Parameters

Run a single test with custom parameters:

```bash
# Using Make
make test-data-cli STORY="My Story" RULE="My Rule" MIN=1 MAX=100

# Using npm
npx playwright test data-driven-cli.spec.ts -- --story="My Story" --rule="My Rule" --min=1 --max=100
```

## Examples

### Example 1: Basic CSV Test

```typescript
runDataDrivenTest(
  {
    dataSource: { csvPath: './data/validation-rules.csv' },
    testName: 'Validation Test'
  },
  async (testData, { page }) => {
    const min = parseFloat(testData.min);
    const max = parseFloat(testData.max);
    expect(min).toBeLessThan(max);
  }
);
```

### Example 2: Filtered Test

```typescript
runDataDrivenTest(
  {
    dataSource: {
      csvPath: './data/validation-rules.csv',
      filters: [
        { field: 'story', value: 'User Registration', operator: 'equals' }
      ]
    },
    testName: 'User Registration Tests'
  },
  async (testData, { page }) => {
    // Only runs for User Registration rows
  }
);
```

### Example 3: Multiple Filters

```typescript
runDataDrivenTest(
  {
    dataSource: {
      csvPath: './data/validation-rules.csv',
      filters: [
        { field: 'story', value: 'User Registration', operator: 'equals' },
        { field: 'min', value: 5, operator: 'greaterThan' }
      ]
    }
  },
  async (testData, { page }) => {
    // Only runs for User Registration rows where min > 5
  }
);
```

### Example 4: Data Transformation

```typescript
runDataDrivenTest(
  {
    dataSource: {
      csvPath: './data/validation-rules.csv',
      transforms: [
        {
          field: 'min',
          transform: (value) => {
            // Double all minimum values
            return parseInt(value) * 2;
          }
        },
        {
          field: 'story',
          transform: (value) => {
            // Prefix all stories
            return `TEST: ${value}`;
          }
        }
      ]
    }
  },
  async (testData, { page }) => {
    // testData.min is now doubled
    // testData.story is now prefixed with "TEST: "
  }
);
```

### Example 5: Real-World UI Test

```typescript
runDataDrivenTest(
  {
    dataSource: {
      csvPath: './data/validation-rules.csv',
      filters: [{ field: 'story', value: 'Password', operator: 'contains' }]
    }
  },
  async (testData, { page }) => {
    await page.goto('https://example.com/register');
    
    // Test below minimum
    const tooShort = 'a'.repeat(parseInt(testData.min) - 1);
    await page.fill('#password', tooShort);
    await page.click('#submit');
    await expect(page.locator('.error')).toContainText('too short');
    
    // Test above maximum
    const tooLong = 'a'.repeat(parseInt(testData.max) + 1);
    await page.fill('#password', tooLong);
    await page.click('#submit');
    await expect(page.locator('.error')).toContainText('too long');
    
    // Test valid
    const valid = 'ValidPass123!';
    await page.fill('#password', valid);
    await page.click('#submit');
    await expect(page.locator('.success')).toBeVisible();
  }
);
```

### Example 6: API Testing with Data

```typescript
runDataDrivenTest(
  {
    dataSource: { csvPath: './data/api-endpoints.csv' }
  },
  async (testData, { request }) => {
    const response = await request.post('https://api.example.com/validate', {
      data: {
        field: testData.rule,
        minLength: testData.min,
        maxLength: testData.max
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.valid).toBe(true);
  }
);
```

## Tips and Best Practices

### 1. Organize Your CSV Files

Keep related test data in separate CSV files:
```
data/
├── user-registration.csv
├── product-validation.csv
└── checkout-flow.csv
```

### 2. Use Descriptive Test Names

```typescript
testName: `${testData.story} - ${testData.rule}`
```

### 3. Combine Filters and Transforms

```typescript
dataSource: {
  csvPath: './data/validation-rules.csv',
  filters: [
    { field: 'story', value: 'User', operator: 'contains' }
  ],
  transforms: [
    { field: 'min', transform: (v) => parseInt(v) }
  ]
}
```

### 4. Add Custom Fields to CSV

You can add any columns you need:
```csv
story,rule,min,max,errorMessage,testUrl
User Registration,Username,3,20,Username too short,/register
```

### 5. Use Environment Variables

```typescript
const baseUrl = process.env.BASE_URL || 'https://example.com';
await page.goto(`${baseUrl}/register`);
```

## Running Tests

```bash
# Run all data-driven tests
make test-data

# Run with grep filter
npx playwright test data-driven.spec.ts --grep "User Registration"

# Run specific test file
make test-data-filtered

# Run with CLI params
make test-data-cli STORY="My Story" RULE="My Rule" MIN=1 MAX=100

# Run in UI mode for debugging
npx playwright test data-driven.spec.ts --ui

# Run in headed mode
npx playwright test data-driven.spec.ts --headed
```

## Troubleshooting

### CSV File Not Found

Ensure the path is relative to the project root:
```typescript
csvPath: './data/my-data.csv'  // Correct
csvPath: 'data/my-data.csv'    // Also works
```

### No Tests Running

Check that:
1. CSV file exists and has data
2. Filters aren't excluding all rows
3. CSV has header row with column names

### Command-Line Params Not Working

Make sure to use double dashes before parameters:
```bash
npx playwright test file.spec.ts -- --story="Test"
#                                 ^^ Important!
```

## API Reference

### CSVDataLoader

#### Methods

- `loadFromFile(csvPath: string): TestDataRow[]`
- `createSingleRow(data: Partial<TestDataRow>): TestDataRow[]`
- `filterData(data: TestDataRow[], filters: DataFilterConfig[]): TestDataRow[]`
- `transformData(data: TestDataRow[], transforms: DataTransformConfig[]): TestDataRow[]`
- `loadData(options: DataLoaderOptions): TestDataRow[]`

### runDataDrivenTest()

#### Parameters

- `config: DataDrivenTestConfig` - Test configuration
  - `dataSource: DataLoaderOptions` - Data source configuration
    - `csvPath?: string` - Path to CSV file
    - `singleRow?: Partial<TestDataRow>` - Single row data
    - `filters?: DataFilterConfig[]` - Data filters
    - `transforms?: DataTransformConfig[]` - Data transformations
  - `testName?: string` - Optional test name prefix
- `testFunction: (testData: TestDataRow, fixtures: any) => Promise<void>` - Test function to run for each row

### Filter Operators

- `equals` - Exact string match
- `contains` - Substring match
- `greaterThan` - Numeric greater than
- `lessThan` - Numeric less than

## Contributing

To add new features:

1. Update `csvDataLoader.ts` for data loading features
2. Update `dataDrivenTest.ts` for test runner features
3. Add examples to this guide
4. Update the main README.md

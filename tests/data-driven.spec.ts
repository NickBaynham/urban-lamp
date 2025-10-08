import { expect } from '@playwright/test';
import { runDataDrivenTest } from '../utils/dataDrivenTest';

/**
 * Example 1: Basic data-driven test from CSV
 * Runs a test for each row in the CSV file
 */
runDataDrivenTest(
  {
    dataSource: {
      csvPath: './data/validation-rules.csv',
    },
    testName: 'Validation Rule Test'
  },
  (testData) => async ({ page }) => {
    // Example test: Verify validation rules
    console.log(`Testing: ${testData.story} - ${testData.rule}`);
    console.log(`  Min: ${testData.min}, Max: ${testData.max}`);
    
    // Simulate a validation check
    const minValue = parseFloat(testData.min);
    const maxValue = parseFloat(testData.max);
    
    expect(minValue).toBeLessThan(maxValue);
    expect(maxValue).toBeGreaterThan(minValue);
    
    // You can add actual page interactions here
    // await page.goto('https://example.com');
    // await page.fill('#input', testData.min);
  }
);

/**
 * Example 2: Filtered data-driven test
 * Only runs tests for "User Registration" story
 */
runDataDrivenTest(
  {
    dataSource: {
      csvPath: './data/validation-rules.csv',
      filters: [
        { field: 'story', value: 'User Registration', operator: 'equals' }
      ]
    },
    testName: 'User Registration Validation'
  },
  (testData) => async ({ page }) => {
    console.log(`Testing User Registration: ${testData.rule}`);
    console.log(`  Range: ${testData.min} - ${testData.max}`);
    
    expect(testData.story).toBe('User Registration');
    expect(parseFloat(testData.min)).toBeGreaterThanOrEqual(0);
  }
);

/**
 * Example 3: Transformed data-driven test
 * Transforms the data before running tests
 */
runDataDrivenTest(
  {
    dataSource: {
      csvPath: './data/validation-rules.csv',
      filters: [
        { field: 'story', value: 'Shopping Cart', operator: 'equals' }
      ],
      transforms: [
        {
          field: 'min',
          transform: (value) => parseInt(value) * 2 // Double the minimum
        },
        {
          field: 'rule',
          transform: (value) => value.toUpperCase() // Convert to uppercase
        }
      ]
    },
    testName: 'Shopping Cart Validation (Transformed)'
  },
  (testData) => async ({ page }) => {
    console.log(`Testing: ${testData.rule}`);
    console.log(`  Transformed Min: ${testData.min}`);
    
    // Verify transformations were applied
    expect(testData.rule).toBe(testData.rule.toUpperCase());
    expect(parseInt(testData.min)).toBeGreaterThanOrEqual(0);
  }
);

/**
 * Example 4: Complex filtering - tests with min value less than 10
 */
runDataDrivenTest(
  {
    dataSource: {
      csvPath: './data/validation-rules.csv',
      filters: [
        { field: 'min', value: 10, operator: 'lessThan' }
      ]
    },
    testName: 'Low Minimum Value Validation'
  },
  (testData) => async ({ page }) => {
    const minValue = parseFloat(testData.min);
    
    console.log(`Testing ${testData.rule} with low min value: ${minValue}`);
    expect(minValue).toBeLessThan(10);
  }
);

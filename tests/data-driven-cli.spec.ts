import { expect } from '@playwright/test';
import { runDataDrivenTest } from '../utils/dataDrivenTest';

/**
 * Command-line driven test
 * 
 * This test can be run in two ways:
 * 
 * 1. With command-line parameters (single test run):
 *    npx playwright test data-driven-cli.spec.ts -- --story="Custom Story" --rule="Custom Rule" --min=5 --max=100
 * 
 * 2. Without parameters (loads from CSV):
 *    npx playwright test data-driven-cli.spec.ts
 * 
 * The test automatically detects if command-line parameters are provided
 * and uses them instead of the CSV file.
 */
runDataDrivenTest(
  {
    dataSource: {
      csvPath: './data/validation-rules.csv',
      // This CSV will be used if no command-line params are provided
    },
    testName: 'CLI or CSV Data-Driven Test'
  },
  (testData) => async ({ page }) => {
    console.log('\n=== Test Data ===');
    console.log(`Story: ${testData.story}`);
    console.log(`Rule: ${testData.rule}`);
    console.log(`Min: ${testData.min}`);
    console.log(`Max: ${testData.max}`);
    console.log('=================\n');
    
    // Validate the data
    const minValue = parseFloat(testData.min);
    const maxValue = parseFloat(testData.max);
    
    expect(testData.story).toBeTruthy();
    expect(testData.rule).toBeTruthy();
    expect(minValue).toBeLessThanOrEqual(maxValue);
    
    // Example: You could use this data to test a real application
    // await page.goto('https://example.com/validation-form');
    // await page.fill('#minInput', testData.min);
    // await page.fill('#maxInput', testData.max);
    // await page.click('#submit');
    // await expect(page.locator('.success')).toBeVisible();
  }
);

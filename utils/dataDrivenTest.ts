import { test as base } from '@playwright/test';
import { CSVDataLoader, DataLoaderOptions, TestDataRow, parseTestParams } from './csvDataLoader';

export interface DataDrivenTestConfig {
  dataSource: DataLoaderOptions;
  testName?: string;
}

/**
 * Creates data-driven tests from CSV or command-line parameters
 * 
 * @example
 * // From CSV file
 * runDataDrivenTest({
 *   dataSource: {
 *     csvPath: './data/test-data.csv',
 *     filters: [{ field: 'rule', value: 'validation', operator: 'contains' }]
 *   }
 * }, (testData) => async ({ page }) => {
 *   // Your test logic here
 *   console.log(testData.story, testData.min, testData.max);
 * });
 * 
 * @example
 * // From command line
 * // npx playwright test --grep "My Test" -- --story="User Story" --min=1 --max=10
 */
export function runDataDrivenTest(
  config: DataDrivenTestConfig,
  testFunction: (testData: TestDataRow) => (fixtures: any) => Promise<void>
) {
  // Check for command-line parameters
  const cmdParams = parseTestParams();
  
  // If command-line params exist, use them; otherwise use config
  const options: DataLoaderOptions = cmdParams 
    ? { singleRow: cmdParams }
    : config.dataSource;

  // Load test data
  const testData = CSVDataLoader.loadData(options);

  // Create a test for each row
  testData.forEach((row, index) => {
    const testName = config.testName 
      ? `${config.testName} [${index + 1}] - Story: ${row.story}, Rule: ${row.rule}`
      : `Data-driven test [${index + 1}] - Story: ${row.story}`;

    base(testName, testFunction(row));
  });
}

/**
 * Decorator-style data-driven test wrapper
 */
export function dataTest(testName: string) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(config: DataDrivenTestConfig) {
      runDataDrivenTest(
        { ...config, testName },
        originalMethod
      );
    };
    
    return descriptor;
  };
}

import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

export interface TestDataRow {
  story: string;
  rule: string;
  min: string;
  max: string;
  [key: string]: string; // Allow additional fields
}

export interface DataFilterConfig {
  field: string;
  value: string | number;
  operator?: 'equals' | 'contains' | 'greaterThan' | 'lessThan';
}

export interface DataTransformConfig {
  field: string;
  transform: (value: string) => string | number;
}

export interface DataLoaderOptions {
  csvPath?: string;
  filters?: DataFilterConfig[];
  transforms?: DataTransformConfig[];
  singleRow?: Partial<TestDataRow>;
}

/**
 * Loads test data from CSV file or command-line parameters
 */
export class CSVDataLoader {
  /**
   * Load data from CSV file
   */
  static loadFromFile(csvPath: string): TestDataRow[] {
    const fullPath = path.resolve(csvPath);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`CSV file not found: ${fullPath}`);
    }

    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    return records as TestDataRow[];
  }

  /**
   * Create a single test data row from parameters
   */
  static createSingleRow(data: Partial<TestDataRow>): TestDataRow[] {
    const defaultRow: TestDataRow = {
      story: data.story || '',
      rule: data.rule || '',
      min: data.min || '',
      max: data.max || '',
      ...data,
    };

    return [defaultRow];
  }

  /**
   * Filter data rows based on criteria
   */
  static filterData(data: TestDataRow[], filters: DataFilterConfig[]): TestDataRow[] {
    if (!filters || filters.length === 0) {
      return data;
    }

    return data.filter(row => {
      return filters.every(filter => {
        const value = row[filter.field];
        const operator = filter.operator || 'equals';

        switch (operator) {
          case 'equals':
            return value === filter.value.toString();
          case 'contains':
            return value.includes(filter.value.toString());
          case 'greaterThan':
            return parseFloat(value) > Number(filter.value);
          case 'lessThan':
            return parseFloat(value) < Number(filter.value);
          default:
            return true;
        }
      });
    });
  }

  /**
   * Transform data rows based on transformation rules
   */
  static transformData(data: TestDataRow[], transforms: DataTransformConfig[]): TestDataRow[] {
    if (!transforms || transforms.length === 0) {
      return data;
    }

    return data.map(row => {
      const transformedRow = { ...row };
      
      transforms.forEach(transform => {
        if (transformedRow[transform.field] !== undefined) {
          const transformedValue = transform.transform(transformedRow[transform.field]);
          transformedRow[transform.field] = transformedValue.toString();
        }
      });

      return transformedRow;
    });
  }

  /**
   * Load, filter, and transform test data based on options
   */
  static loadData(options: DataLoaderOptions): TestDataRow[] {
    let data: TestDataRow[];

    // Load data from file or single row
    if (options.singleRow) {
      data = this.createSingleRow(options.singleRow);
    } else if (options.csvPath) {
      data = this.loadFromFile(options.csvPath);
    } else {
      throw new Error('Either csvPath or singleRow must be provided');
    }

    // Apply filters
    if (options.filters) {
      data = this.filterData(data, options.filters);
    }

    // Apply transformations
    if (options.transforms) {
      data = this.transformData(data, options.transforms);
    }

    return data;
  }
}

/**
 * Helper to parse command-line arguments or environment variables for data-driven tests
 * 
 * Priority:
 * 1. Environment variables (TEST_STORY, TEST_RULE, TEST_MIN, TEST_MAX)
 * 2. Command-line arguments (--story="User Story" --rule="Business Rule" --min=1 --max=10)
 */
export function parseTestParams(): Partial<TestDataRow> | null {
  const params: Partial<TestDataRow> = {};

  // First, check environment variables
  if (process.env.TEST_STORY) params.story = process.env.TEST_STORY;
  if (process.env.TEST_RULE) params.rule = process.env.TEST_RULE;
  if (process.env.TEST_MIN) params.min = process.env.TEST_MIN;
  if (process.env.TEST_MAX) params.max = process.env.TEST_MAX;

  // If env vars found, return them
  if (Object.keys(params).length > 0) {
    return params;
  }

  // Otherwise, try command-line arguments
  const args = process.argv.slice(2);
  args.forEach(arg => {
    const match = arg.match(/--(\w+)=(.+)/);
    if (match) {
      const [, key, value] = match;
      params[key] = value.replace(/^["']|["']$/g, ''); // Remove quotes
    }
  });

  // Check if we have at least one parameter
  return Object.keys(params).length > 0 ? params : null;
}

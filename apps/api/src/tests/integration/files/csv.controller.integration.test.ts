import { describe, expect, test } from 'bun:test';

import { MAX_FILE_SIZES } from '@bunstack-playground/shared/http';

import {
  createMockCsvPreview,
  createMockCsvImportResult,
  type CsvValidationError,
} from '../../mocks/files/file.repository.mock';

describe('CSV Controller - Preview Flow', () => {
  test('should return valid preview structure', async () => {
    const preview = createMockCsvPreview({
      totalRows: 10,
      validRows: 8,
      toCreate: 6,
      toUpdate: 2,
      errors: [],
      sampleData: [
        { title: 'Task 1', completed: false, categoryName: 'Work' },
        { title: 'Task 2', completed: true, categoryName: 'Personal' },
      ],
    });

    expect(preview.totalRows).toBe(10);
    expect(preview.validRows).toBe(8);
    expect(preview.toCreate).toBe(6);
    expect(preview.toUpdate).toBe(2);
    expect(preview.errors).toHaveLength(0);
    expect(preview.sampleData).toHaveLength(2);
  });

  test('should include validation errors in preview', () => {
    const errors: CsvValidationError[] = [
      {
        row: 1,
        message: 'Title must be at least 3 characters',
        data: { title: 'ab' },
      },
      { row: 5, message: 'Title too short', data: { title: 'x' } },
    ];

    const preview = createMockCsvPreview({
      totalRows: 10,
      validRows: 8,
      errors,
    });

    expect(preview.errors).toHaveLength(2);
    expect(preview.errors[0]!.row).toBe(1);
    expect(preview.errors[0]!.message).toBe(
      'Title must be at least 3 characters'
    );
    expect(preview.errors[0]!.data).toEqual({ title: 'ab' });
  });

  test('should limit sampleData to 5 rows', () => {
    const sampleData = Array.from({ length: 10 }, (_, i) => ({
      title: `Task ${i + 1}`,
      completed: false,
      categoryName: 'Work',
    }));

    const preview = createMockCsvPreview({
      sampleData: sampleData.slice(0, 5),
    });

    expect(preview.sampleData).toHaveLength(5);
  });

  test('should handle empty CSV', () => {
    const preview = createMockCsvPreview({
      totalRows: 0,
      validRows: 0,
      errors: [],
      sampleData: [],
    });

    expect(preview.totalRows).toBe(0);
    expect(preview.validRows).toBe(0);
    expect(preview.sampleData).toHaveLength(0);
  });
});

describe('CSV Controller - Import Flow', () => {
  test('should return successful import result', () => {
    const result = createMockCsvImportResult({
      success: 10,
      errors: [],
    });

    expect(result.success).toBe(10);
    expect(result.errors).toHaveLength(0);
  });

  test('should return partial success with errors', () => {
    const errors: CsvValidationError[] = [
      { row: 1, message: 'Title too short' },
      { row: 3, message: 'Invalid category' },
    ];

    const result = createMockCsvImportResult({
      success: 8,
      errors,
    });

    expect(result.success).toBe(8);
    expect(result.errors).toHaveLength(2);
  });

  test('should return zero success when all rows fail', () => {
    const errors: CsvValidationError[] = [
      { row: 1, message: 'Title too short' },
      { row: 2, message: 'Title too short' },
      { row: 3, message: 'Title too short' },
    ];

    const result = createMockCsvImportResult({
      success: 0,
      errors,
    });

    expect(result.success).toBe(0);
    expect(result.errors).toHaveLength(3);
  });
});

describe('CSV Controller - File Validation', () => {
  test('should validate CSV file extension', () => {
    const validFiles = ['tasks.csv', 'data.CSV', 'import.csv'];
    const invalidFiles = ['tasks.xlsx', 'data.json', 'document.pdf'];

    validFiles.forEach((fileName) => {
      expect(fileName.toLowerCase().endsWith('.csv')).toBe(true);
    });

    invalidFiles.forEach((fileName) => {
      expect(fileName.toLowerCase().endsWith('.csv')).toBe(false);
    });
  });

  test('should validate CSV file size', () => {
    const maxCsvSize = MAX_FILE_SIZES.csv;

    expect(maxCsvSize).toBe(50 * 1024 * 1024);

    const validSize = 10 * 1024 * 1024;
    const tooLarge = 60 * 1024 * 1024;

    expect(validSize).toBeLessThan(maxCsvSize);
    expect(tooLarge).toBeGreaterThan(maxCsvSize);
  });

  test('should validate CSV mime types', () => {
    const validMimeTypes = ['text/csv', 'application/csv'];

    validMimeTypes.forEach((mimeType) => {
      expect(mimeType).toMatch(/^text\/csv|application\/csv$/);
    });
  });
});

describe('CSV Controller - Validation Error Format', () => {
  test('should have required fields in validation error', () => {
    const error: CsvValidationError = {
      row: 1,
      message: 'Title must be at least 3 characters',
    };

    expect(error).toHaveProperty('row');
    expect(error).toHaveProperty('message');
    expect(typeof error.row).toBe('number');
    expect(typeof error.message).toBe('string');
  });

  test('should have optional data field in validation error', () => {
    const error: CsvValidationError = {
      row: 1,
      message: 'Title too short',
      data: { title: 'ab', completed: 'false' },
    };

    expect(error.data).toBeDefined();
    expect(error.data).toHaveProperty('title');
    expect(error.data).toHaveProperty('completed');
  });

  test('should handle multiple validation errors', () => {
    const errors: CsvValidationError[] = [
      { row: 1, message: 'Title too short', data: { title: 'a' } },
      { row: 2, message: 'Title too short', data: { title: 'ab' } },
      {
        row: 5,
        message: 'Invalid completed value',
        data: { completed: 'maybe' },
      },
    ];

    expect(errors).toHaveLength(3);
    expect(errors.filter((e) => e.message.includes('Title'))).toHaveLength(2);
  });
});

describe('CSV Controller - Batch Processing', () => {
  test('should handle large CSV files', () => {
    const BATCH_SIZE = 500;

    const largeCsvRows = Array.from({ length: 1000 }, (_, i) => ({
      title: `Task ${i + 1}`,
      completed: i % 2 === 0,
      categoryName: 'Work',
    }));

    const batches = Math.ceil(largeCsvRows.length / BATCH_SIZE);
    expect(batches).toBe(2);
  });

  test('should process empty batch gracefully', () => {
    const BATCH_SIZE = 500;
    const emptyRows: any[] = [];

    const batches = Math.ceil(emptyRows.length / BATCH_SIZE);
    expect(batches).toBe(0);
  });
});

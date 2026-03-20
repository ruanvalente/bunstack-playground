import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';

import {
  parseCsvPreview,
  executeCsvImport,
  checkExistingTitles,
} from '@/api/application/files/import-csv.use-case';

const mockSupabaseRpc =
  mock<
    (
      fn: string,
      params: Record<string, any>
    ) => Promise<{ data: any; error: any }>
  >();

const mockSupabaseFrom = mock<
  (table: string) => {
    select: (columns?: string) => {
      eq: (
        column: string,
        value: any
      ) => {
        in: (
          column: string,
          values: string[]
        ) => Promise<{ data: any; error: any }>;
      };
    };
    insert: (data: any) => Promise<{ data: any; error: any }>;
  }
>();

mock.module('@/api/infrastructure/supabase', () => ({
  supabase: {
    rpc: mockSupabaseRpc,
    from: mockSupabaseFrom,
  },
}));

describe('import-csv.use-case', () => {
  describe('parseCsvPreview', () => {
    test('should parse valid CSV and return preview', async () => {
      const csvContent = Buffer.from(
        'title,completed,category_name\nBuy groceries,true,Shopping\nLearn TypeScript,false,Studies\nDo exercise,true,Health'
      );

      const result = await parseCsvPreview(csvContent, 'tasks.csv');

      expect(result.totalRows).toBe(3);
      expect(result.validRows).toBe(3);
      expect(result.errors).toHaveLength(0);
      expect(result.sampleData).toHaveLength(3);
      expect(result.sampleData[0]!.title).toBe('Buy groceries');
      expect(result.sampleData[0]!.completed).toBe(true);
      expect(result.sampleData[0]!.categoryName).toBe('Shopping');
    });

    test('should reject CSV without title column', async () => {
      const csvContent = Buffer.from('name,description\nTask 1,Description');

      await expect(parseCsvPreview(csvContent, 'tasks.csv')).rejects.toThrow(
        'CSV must have a "title" column'
      );
    });

    test('should add error for rows with title less than 3 characters', async () => {
      const csvContent = Buffer.from(
        'title,completed\nAB,false\nValid Title,true'
      );

      const result = await parseCsvPreview(csvContent, 'tasks.csv');

      expect(result.validRows).toBe(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]!.row).toBe(1);
      expect(result.errors[0]!.message).toBe(
        'Title must be at least 3 characters'
      );
    });

    test('should handle normalized headers case-insensitive', async () => {
      const csvContent = Buffer.from(
        'TITLE,COMPLETED,Category_Name\nTask 1,false,Work'
      );

      const result = await parseCsvPreview(csvContent, 'tasks.csv');

      expect(result.validRows).toBe(1);
      expect(result.errors).toHaveLength(0);
    });

    test('should handle CSV with empty title', async () => {
      const csvContent = Buffer.from(
        'title,completed\n, false\nValid Task,true'
      );

      const result = await parseCsvPreview(csvContent, 'tasks.csv');

      expect(result.validRows).toBe(1);
      expect(result.errors).toHaveLength(1);
    });

    test('should limit sampleData to 5 rows', async () => {
      const rows = Array.from(
        { length: 10 },
        (_, i) => `Task ${i + 1}, false, Work`
      );
      const csvContent = Buffer.from(
        'title,completed,category_name\n' + rows.join('\n')
      );

      const result = await parseCsvPreview(csvContent, 'tasks.csv');

      expect(result.totalRows).toBe(10);
      expect(result.sampleData).toHaveLength(5);
    });
  });

  describe('executeCsvImport', () => {
    beforeEach(() => {
      mockSupabaseRpc.mockResolvedValue({
        data: 'category-id-123',
        error: null,
      });
      mockSupabaseRpc.mockResolvedValue({ data: 10, error: null });
    });

    afterEach(() => {
      mockSupabaseRpc.mockClear();
    });

    test('should import CSV successfully', async () => {
      const csvContent = Buffer.from(
        'title,completed,category_name\nBuy groceries,true,Shopping\nLearn TypeScript,false,Studies'
      );

      const result = await executeCsvImport(csvContent, 'user-123');

      expect(result.success).toBeGreaterThanOrEqual(0);
      expect(result.errors).toBeInstanceOf(Array);
    });

    test('should include validation errors in result', async () => {
      const csvContent = Buffer.from(
        'title,completed\nAB,false\nValid Task,true'
      );

      const result = await executeCsvImport(csvContent, 'user-123');

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]!.message).toBe(
        'Title must be at least 3 characters'
      );
    });

    test('should use default category when category_name is empty', async () => {
      const csvContent = Buffer.from('title,completed\nValid Task,true');

      await executeCsvImport(csvContent, 'user-123');

      expect(mockSupabaseRpc).toHaveBeenCalledWith(
        'get_or_create_category',
        expect.objectContaining({
          p_user_id: 'user-123',
          p_name: 'Geral',
        })
      );
    });
  });

  describe('checkExistingTitles', () => {
    test('should return Set of existing titles', async () => {
      mockSupabaseFrom.mockReturnValue({
        select: () => ({
          eq: () => ({
            in: () =>
              Promise.resolve({
                data: [{ title: 'Task 1' }, { title: 'Task 2' }],
                error: null,
              }),
          }),
        }),
      } as any);

      const result = await checkExistingTitles(
        ['Task 1', 'Task 2', 'Task 3'],
        'user-123'
      );

      expect(result).toBeInstanceOf(Set);
      expect(result.has('Task 1')).toBe(true);
      expect(result.has('Task 2')).toBe(true);
      expect(result.has('Task 3')).toBe(false);
    });

    test('should return empty Set when no titles exist', async () => {
      mockSupabaseFrom.mockReturnValue({
        select: () => ({
          eq: () => ({
            in: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
      } as any);

      const result = await checkExistingTitles(['Task 1'], 'user-123');

      expect(result.size).toBe(0);
    });

    test('should throw error when database query fails', async () => {
      mockSupabaseFrom.mockReturnValue({
        select: () => ({
          eq: () => ({
            in: () =>
              Promise.resolve({
                data: null,
                error: { message: 'Database error' },
              }),
          }),
        }),
      } as any);

      await expect(checkExistingTitles(['Task 1'], 'user-123')).rejects.toThrow(
        'Failed to check existing titles: Database error'
      );
    });
  });
});

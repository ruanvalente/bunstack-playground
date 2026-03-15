import csvParser from 'csv-parser';
import { Readable } from 'stream';

import type { CsvImportPreviewDTO } from '@bunstack-playground/shared/http';

import { supabase } from '@/api/infrastructure/supabase';

const BATCH_SIZE = 500;
const DEFAULT_CATEGORY_NAME = 'Geral';
const DEFAULT_CATEGORY_COLOR = '#6B7280';

type ParsedRow = {
  title: string;
  completed: boolean;
  categoryName: string | undefined;
};

type ValidationError = {
  row: number;
  message: string;
  data?: Record<string, string>;
};

export async function parseCsvPreview(
  buffer: Buffer,
  _fileName: string
): Promise<CsvImportPreviewDTO> {
  const rows: ParsedRow[] = [];
  const errors: ValidationError[] = [];
  let rowNumber = 0;
  let hasValidHeaders = false;

  return new Promise((resolve, reject) => {
    const stream = Readable.from(buffer.toString('utf-8'));

    stream
      .pipe(csvParser())
      .on('headers', (headers: string[]) => {
        const normalizedHeaders = headers.map((h) => h.trim().toLowerCase());
        if (!normalizedHeaders.includes('title')) {
          reject(new Error('CSV must have a "title" column'));
          return;
        }
        hasValidHeaders = true;
      })
      .on('data', (data: Record<string, string>) => {
        rowNumber++;
        const normalizedData: Record<string, string> = {};

        Object.entries(data).forEach(([key, value]) => {
          normalizedData[key.trim().toLowerCase()] = value?.trim() || '';
        });

        const title = normalizedData['title'];

        if (!title || title.length < 3) {
          errors.push({
            row: rowNumber,
            message: 'Title must be at least 3 characters',
            data: normalizedData,
          });
          return;
        }

        const completedStr = normalizedData['completed']?.toLowerCase();
        const completed = completedStr === 'true';

        const categoryName = normalizedData['category_name'] || undefined;

        rows.push({
          title,
          completed,
          categoryName,
        });
      })
      .on('end', async () => {
        if (!hasValidHeaders) {
          reject(new Error('Invalid CSV format'));
          return;
        }

        const sampleData = rows.slice(0, 5).map((row) => ({
          title: row.title,
          completed: row.completed,
          categoryName: row.categoryName,
        }));

        resolve({
          totalRows: rowNumber,
          validRows: rows.length,
          toCreate: 0,
          toUpdate: 0,
          errors,
          sampleData,
        });
      })
      .on('error', (error: Error) => {
        reject(error);
      });
  });
}

export async function executeCsvImport(
  buffer: Buffer,
  userId: string
): Promise<{ success: number; errors: ValidationError[] }> {
  const rows: ParsedRow[] = [];
  const errors: ValidationError[] = [];
  let rowNumber = 0;

  return new Promise((resolve, reject) => {
    const stream = Readable.from(buffer.toString('utf-8'));

    stream
      .pipe(csvParser())
      .on('data', (data: Record<string, string>) => {
        rowNumber++;
        const normalizedData: Record<string, string> = {};

        Object.entries(data).forEach(([key, value]) => {
          normalizedData[key.trim().toLowerCase()] = value?.trim() || '';
        });

        const title = normalizedData['title'];

        if (!title || title.length < 3) {
          errors.push({
            row: rowNumber,
            message: 'Title must be at least 3 characters',
          });
          return;
        }

        const completedStr = normalizedData['completed']?.toLowerCase();
        const completed = completedStr === 'true';

        const categoryName = normalizedData['category_name'] || undefined;

        rows.push({
          title,
          completed,
          categoryName,
        });
      })
      .on('end', async () => {
        try {
          const successCount = await processBatchImport(rows, userId, errors);
          resolve({ success: successCount, errors });
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error: Error) => {
        reject(error);
      });
  });
}

async function processBatchImport(
  rows: ParsedRow[],
  userId: string,
  errors: ValidationError[]
): Promise<number> {
  const categoryMap = new Map<string, string>();

  const categoryNames = new Set<string>();
  rows.forEach((row) => {
    if (row.categoryName) {
      categoryNames.add(row.categoryName);
    }
    categoryNames.add(DEFAULT_CATEGORY_NAME);
  });

  for (const categoryName of categoryNames) {
    const color =
      categoryName === DEFAULT_CATEGORY_NAME
        ? DEFAULT_CATEGORY_COLOR
        : `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, '0')}`;

    const { data: categoryData, error: categoryError } = await supabase.rpc(
      'get_or_create_category',
      {
        p_user_id: userId,
        p_name: categoryName,
        p_color: color,
      }
    );

    if (categoryError) {
      console.error('Category error:', categoryError.message);
      continue;
    }

    if (categoryData) {
      categoryMap.set(categoryName, categoryData);
    }
  }

  const defaultCategoryId = categoryMap.get(DEFAULT_CATEGORY_NAME);

  if (!defaultCategoryId) {
    errors.push({
      row: 1,
      message: 'Failed to get default category',
    });
    return 0;
  }

  let successCount = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);

    const tasksToInsert = batch.map((row) => {
      const categoryId = row.categoryName
        ? categoryMap.get(row.categoryName) || defaultCategoryId
        : defaultCategoryId;

      return {
        id: crypto.randomUUID(),
        user_id: userId,
        title: row.title,
        completed: row.completed,
        category_id: categoryId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });

    const { data: insertResult, error } = await supabase.rpc(
      'insert_tasks_batch',
      {
        tasks_data: tasksToInsert as any,
      }
    );

    if (error) {
      console.error('Batch insert error:', error.message);
      errors.push({
        row: i + 1,
        message: `Batch insert failed: ${error.message}`,
      });
    } else {
      successCount += insertResult || batch.length;
    }
  }

  return successCount;
}

export async function checkExistingTitles(
  titles: string[],
  userId: string
): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('tasks')
    .select('title')
    .eq('user_id', userId)
    .in('title', titles);

  if (error) {
    throw new Error(`Failed to check existing titles: ${error.message}`);
  }

  return new Set((data || []).map((t) => t.title));
}

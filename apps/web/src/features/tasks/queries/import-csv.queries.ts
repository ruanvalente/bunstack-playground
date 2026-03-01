import { axiosInstance } from '@shared/http/axios-client';
import { API_URL } from '@shared/config/supabase';

export type CsvImportPreview = {
  totalRows: number;
  validRows: number;
  toCreate: number;
  toUpdate: number;
  errors: Array<{
    row: number;
    message: string;
    data?: Record<string, string>;
  }>;
  sampleData: Array<{
    title: string;
    completed: boolean;
    categoryName?: string;
  }>;
};

export async function previewCsvImport(file: File): Promise<CsvImportPreview> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post<CsvImportPreview>(
    `${API_URL}/api/v1/tasks/import-csv`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
}

export async function confirmCsvImport(file: File): Promise<{
  success: number;
  errors: Array<{ row: number; message: string }>;
}> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post<{
    success: number;
    errors: Array<{ row: number; message: string }>;
  }>(`${API_URL}/api/v1/tasks/import-csv/confirm`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export function downloadCsvTemplate() {
  const csvContent =
    'title,completed,category_name\n"Tarefa exemplo 1",false,"Trabalho"\n"Tarefa exemplo 2",true,"Pessoal"';
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'template_tarefas.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

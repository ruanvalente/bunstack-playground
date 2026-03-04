import { useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  Check,
  Download,
  FileText,
  Upload,
  X,
} from 'lucide-react';

import { useLanguage } from '@shared/hooks/use-language';
import { toast } from '@shared/ui/toaster';

import {
  confirmCsvImport,
  type CsvImportPreview,
  downloadCsvTemplate,
  previewCsvImport,
} from '../queries/import-csv.queries';

interface ImportCsvWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportCsvWidget({ isOpen, onClose }: ImportCsvWidgetProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<CsvImportPreview | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const queryClient = useQueryClient();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error(t.import.selectCsv);
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error(t.import.fileTooLarge);
      return;
    }

    setSelectedFile(file);
    setIsPreviewLoading(true);

    try {
      const data = await previewCsvImport(file);
      setPreview(data);
    } catch (error) {
      toast.error(t.import.failedToParse);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!selectedFile) return;

    setIsConfirming(true);
    try {
      const result = await confirmCsvImport(selectedFile);
      toast.success(
        t.import.successImport.replace('{count}', String(result.success))
      );
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      handleClose();
    } catch (error) {
      toast.error(t.import.failedToImport);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleDownloadTemplate = () => {
    downloadCsvTemplate();
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    onClose();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-opacity-95 flex justify-center items-center z-20">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">{t.import.importTasksFromCsv}</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          {!preview && !isPreviewLoading && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                >
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span>{t.import.selectCsvFile}</span>
                </button>
                <button
                  onClick={handleDownloadTemplate}
                  className="flex items-center justify-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-6 h-6 text-gray-400" />
                  <span>{t.import.template}</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileSelect}
              />

              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">{t.import.csvFormat}:</p>
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-xs">
                  title,completed,category_name
                  <br />
                  "Tarefa 1",false,"Trabalho"
                  <br />
                  "Tarefa 2",true,"Pessoal"
                </div>
                <ul className="mt-2 space-y-1 text-gray-500">
                  <li>
                    - <code>title</code> (required): Task title
                  </li>
                  <li>
                    - <code>completed</code> (optional): true or false
                  </li>
                  <li>
                    - <code>category_name</code> (optional): Category name
                  </li>
                </ul>
              </div>
            </div>
          )}

          {isPreviewLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">{t.import.processingCsv}</p>
            </div>
          )}

          {preview && !isPreviewLoading && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-medium">{selectedFile?.name}</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold">{preview.totalRows}</p>
                  <p className="text-sm text-gray-600">{t.import.totalRows}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {preview.validRows}
                  </p>
                  <p className="text-sm text-gray-600">{t.import.valid}</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">
                    {preview.errors.length}
                  </p>
                  <p className="text-sm text-gray-600">{t.import.errors}</p>
                </div>
              </div>

              {preview.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    {t.import.errors}
                  </h4>
                  <div className="max-h-40 overflow-y-auto bg-red-50 rounded-lg p-2">
                    {preview.errors.slice(0, 10).map((error, idx) => (
                      <div
                        key={idx}
                        className="text-sm p-2 bg-white rounded mb-1"
                      >
                        <span className="font-medium">
                          {t.import.row} {error.row}:
                        </span>{' '}
                        {error.message}
                      </div>
                    ))}
                    {preview.errors.length > 10 && (
                      <p className="text-sm text-gray-500 text-center">
                        {t.import.moreErrors.replace(
                          '{count}',
                          String(preview.errors.length - 10)
                        )}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {preview.sampleData.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">{t.import.preview}</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left">
                            {t.common.title}
                          </th>
                          <th className="px-3 py-2 text-left">
                            {t.common.completed}
                          </th>
                          <th className="px-3 py-2 text-left">
                            {t.common.category}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {preview.sampleData.map((row, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="px-3 py-2">{row.title}</td>
                            <td className="px-3 py-2">
                              {row.completed ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <X className="w-4 h-4 text-gray-300" />
                              )}
                            </td>
                            <td className="px-3 py-2">
                              {row.categoryName || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            {t.common.cancel}
          </button>
          {preview && (
            <button
              onClick={handleConfirmImport}
              disabled={isConfirming || preview.validRows === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConfirming
                ? t.import.importing
                : t.import.importTasks.replace(
                    '{count}',
                    String(preview.validRows)
                  )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

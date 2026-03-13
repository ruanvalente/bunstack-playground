import { Download, Eye, File, FileText, Image, Upload, X } from 'lucide-react';

import { useTaskAttachments } from '../hooks/use-task-attachments';
import type { TaskAttachment } from '../queries/task-files.queries';

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return <Image className="w-4 h-4" />;
  if (mimeType === 'application/pdf') return <FileText className="w-4 h-4" />;
  return <File className="w-4 h-4" />;
}

function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

type FileAttachmentsWidgetProps = {
  taskId: string;
};

export function FileAttachmentsWidget({ taskId }: FileAttachmentsWidgetProps) {
  const {
    files,
    isLoading,
    isDragging,
    selectedFile,
    setSelectedFile,
    fileInputRef,
    isUploading,
    isDeleting,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    handleDelete,
    openFileInput,
  } = useTaskAttachments(taskId);

  return (
    <div className="space-y-3">
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileInput}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx,.txt,.csv"
        />
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">Drag & drop or click to upload</p>
        <p className="text-xs text-gray-400 mt-1">
          Images, PDF, DOC, TXT, CSV (max 10MB)
        </p>
      </div>

      {isLoading && (
        <div className="text-center text-sm text-gray-500">
          Loading files...
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Attachments</h4>
          {files.map((file: TaskAttachment) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
            >
              <div
                className="flex items-center gap-2 min-w-0 cursor-pointer flex-1"
                onClick={() => setSelectedFile(file)}
              >
                {isImage(file.mimeType) && file.publicUrl ? (
                  <img
                    src={file.publicUrl}
                    alt={file.fileName}
                    className="w-8 h-8 object-cover rounded"
                  />
                ) : (
                  getFileIcon(file.mimeType)
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate max-w-[150px]">
                    {file.fileName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.fileSize)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {file.publicUrl && (
                  <a
                    href={file.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-gray-500 hover:text-blue-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => handleDelete(file.id)}
                  className="p-1 text-gray-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isDeleting}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isUploading && (
        <div className="text-center text-sm text-blue-600">Uploading...</div>
      )}

      {selectedFile && (
        <FilePreviewModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
}

function FilePreviewModal({
  file,
  onClose,
}: {
  file: TaskAttachment;
  onClose: () => void;
}) {
  const isImageFile = isImage(file.mimeType);
  const isPdf = file.mimeType === 'application/pdf';

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-opacity-95 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2 min-w-0">
            {isImageFile ? (
              <Image className="w-5 h-5 text-blue-500" />
            ) : isPdf ? (
              <FileText className="w-5 h-5 text-red-500" />
            ) : (
              <File className="w-5 h-5 text-gray-500" />
            )}
            <h3 className="text-lg font-semibold truncate">{file.fileName}</h3>
          </div>
          <div className="flex items-center gap-2">
            {file.publicUrl && (
              <a
                href={file.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-4 overflow-auto max-h-[calc(90vh-80px)] flex items-center justify-center bg-gray-50">
          {isImageFile && file.publicUrl ? (
            <img
              src={file.publicUrl}
              alt={file.fileName}
              className="max-w-full max-h-full object-contain rounded"
            />
          ) : isPdf && file.publicUrl ? (
            <iframe
              src={file.publicUrl}
              className="w-full h-[60vh] rounded"
              title={file.fileName}
            />
          ) : (
            <div className="text-center py-12">
              <File className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                Preview not available for this file type
              </p>
              {file.publicUrl && (
                <a
                  href={file.publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 dark:bg-primary-dark dark:hover:bg-primary-dark/80"
                >
                  <Download className="w-4 h-4" />
                  Download File
                </a>
              )}
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Size: {formatFileSize(file.fileSize)}</span>
            <span>Type: {file.mimeType}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

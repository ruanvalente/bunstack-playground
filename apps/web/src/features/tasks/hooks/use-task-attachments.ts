import { useCallback, useRef, useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from '@shared/ui/toaster';

import type { TaskAttachment } from '../queries/task-files.queries';
import {
  deleteTaskFile,
  listTaskFiles,
  uploadTaskFile,
} from '../queries/task-files.queries';

export function useTaskAttachments(taskId: string) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<TaskAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: files = [], isLoading } = useQuery({
    queryKey: ['files', taskId],
    queryFn: () => listTaskFiles(taskId),
    enabled: !!taskId,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadTaskFile(taskId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', taskId] });
      toast.success('File uploaded successfully');
    },
    onError: () => {
      toast.error('Failed to upload file');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (fileId: string) => deleteTaskFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', taskId] });
      toast.success('File deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete file');
    },
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        const file = droppedFiles[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
          toast.error('File too large. Maximum size is 10MB');
          return;
        }
        uploadMutation.mutate(file);
      }
    },
    [uploadMutation]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        const file = selectedFiles[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
          toast.error('File too large. Maximum size is 10MB');
          return;
        }
        uploadMutation.mutate(file);
      }
    },
    [uploadMutation]
  );

  const handleDelete = useCallback(
    (fileId: string) => {
      deleteMutation.mutate(fileId);
    },
    [deleteMutation]
  );

  const openFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    files,
    isLoading,
    isDragging,
    selectedFile,
    setSelectedFile,
    fileInputRef,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    handleDelete,
    openFileInput,
  };
}

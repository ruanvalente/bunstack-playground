import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useUpdateTaskTitle } from '../hooks/use-update-task-title';
import type { Task } from '@bunstack-playground/shared/domain';
import {
  editTaskTitleSchema,
  type EditTaskTitleDTO,
} from '@bunstack-playground/shared/http';
import { CategorySelect } from '../../categories/ui/category-select';
import { useState, useEffect } from 'react';

type EditTaskModalProps = {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
};

export function EditTaskModal({ isOpen, task, onClose }: EditTaskModalProps) {
  const mutation = useUpdateTaskTitle();
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditTaskTitleDTO>({
    resolver: zodResolver(editTaskTitleSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      title: '',
    },
  });

  useEffect(() => {
    if (task) {
      setCategoryId(task.categoryId);
      reset({ title: task.title });
    }
  }, [task, reset]);

  const onSubmit = (data: EditTaskTitleDTO) => {
    if (!task) return;

    mutation.mutate(
      { id: task.id, title: data.title, categoryId },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  };

  if (!isOpen || !task) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-opacity-95 flex justify-center items-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Task title
            </label>
            <input
              type="text"
              id="title"
              defaultValue={task.title}
              {...register('title')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <CategorySelect value={categoryId} onChange={setCategoryId} />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

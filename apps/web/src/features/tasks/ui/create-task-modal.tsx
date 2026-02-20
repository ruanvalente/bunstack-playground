import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  createTaskSchema,
  type CreateTaskDTO,
} from '@bunstack-playground/shared/http';
import { useCreateTask } from '../hooks/use-create-task';

type CreateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTaskDTO>({
    resolver: zodResolver(createTaskSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });
  const mutation = useCreateTask();

  const onSubmit = (data: CreateTaskDTO) => {
    mutation.mutate(data.title, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-opacity-95 flex justify-center items-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create Task</h2>
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
              {...register('title')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
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
              {mutation.isPending ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

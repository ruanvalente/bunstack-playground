import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { editUserFormSchema } from '@bunstack-playground/shared/http';

import { useLanguage } from '@shared/hooks/use-language';

import { useUpdateUser } from '../hooks/use-users';

type User = {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
};

type EditUserModalProps = {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
};

type EditUserFormData = z.infer<typeof editUserFormSchema>;

export function EditUserModal({ isOpen, user, onClose }: EditUserModalProps) {
  const { t } = useLanguage();
  const mutation = useUpdateUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      name: '',
      role: 'USER',
      status: 'active',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        role: user.role,
        status: user.status,
      });
    }
  }, [user, reset]);

  const onSubmit = (data: EditUserFormData) => {
    if (!user) return;

    mutation.mutate(
      {
        id: user.id,
        input: {
          name: data.name,
          role: data.role,
          status: data.status,
        },
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen || !user) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-opacity-95 flex justify-center items-center z-10">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {t.users.editUser}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              {t.users.email}
            </label>
            <input
              type="email"
              id="email"
              value={user.email}
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t.users.email} cannot be changed
            </p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              {t.users.name}
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              {t.users.role}
            </label>
            <select
              id="role"
              {...register('role')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              {t.users.status}
            </label>
            <select
              id="status"
              {...register('status')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-xs mt-1">
                {errors.status.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-primary-dark dark:hover:bg-primary-dark/80 dark:disabled:bg-gray-500"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? t.users.saving : t.users.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

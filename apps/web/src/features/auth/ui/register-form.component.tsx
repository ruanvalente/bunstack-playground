import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useLanguage } from '@shared/hooks/use-language';
import { toast } from '@shared/ui/toaster';

import { useAuth } from '../hooks/use-auth';

const registerFormSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email('invalidEmail'),
    password: z
      .string()
      .min(8, 'passwordMinLength')
      .refine((password) => /[A-Z]/.test(password), {
        message: 'passwordRequireUppercase',
      })
      .refine((password) => /[0-9]/.test(password), {
        message: 'passwordRequireNumber',
      }),
  })
  .strict();

type RegisterFormData = z.infer<typeof registerFormSchema>;

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function EyeSlashIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );
}

export function RegisterForm() {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRules, setShowPasswordRules] = useState(false);

  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const password = watch('password', '');

  const passwordRules = [
    {
      key: 'minLength',
      test: password.length >= 8,
      label: t.auth.atLeast8Chars,
    },
    {
      key: 'uppercase',
      test: /[A-Z]/.test(password),
      label: t.auth.atLeast1Uppercase,
    },
    {
      key: 'number',
      test: /[0-9]/.test(password),
      label: t.auth.atLeast1Number,
    },
  ];

  const getErrorMessage = (message: string | undefined) => {
    if (!message) return '';
    const key = message as keyof typeof t.auth;
    return t.auth[key as keyof typeof t.auth] || message;
  };

  const onSubmit = async (data: RegisterFormData) => {
    const result = await registerUser({
      email: data.email,
      password: data.password,
      name: data.name || '',
    });

    if (!result.success) {
      toast.error(result.error || 'Registration failed');
    } else {
      toast.success('Check your email to confirm your account');
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-primary mb-6">
        {t.auth.createAccount}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t.auth.yourName}
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="John Doe"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t.auth.email}
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {getErrorMessage(errors.email.message)}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t.auth.password}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              onFocus={() => setShowPasswordRules(true)}
              className="w-full px-4 py-3 pr-12 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {getErrorMessage(errors.password.message)}
            </p>
          )}

          {showPasswordRules && password.length > 0 && (
            <motion.div
              className="mt-3 p-3 bg-gray-50 rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-xs font-medium text-gray-600 mb-2">
                {t.auth.passwordStrength}
              </p>
              <ul className="space-y-1">
                {passwordRules.map((rule) => (
                  <li
                    key={rule.key}
                    className={`text-xs flex items-center gap-2 ${
                      rule.test ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    <span className={rule.test ? '✓' : '○'} />
                    {rule.label}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          {isSubmitting ? t.auth.signUpLoading : t.auth.signUp}
        </motion.button>
      </form>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-soft text-muted">
              {t.auth.orContinueWith}
            </span>
          </div>
        </div>

        <button
          disabled
          className="mt-4 w-full py-3 px-4 border border-border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-all opacity-50 cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          {t.auth.github}
        </button>
      </motion.div>
    </div>
  );
}

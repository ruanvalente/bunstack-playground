import { useState } from 'react';
import { LoginForm } from '../components/login-form.component';
import { RegisterForm } from '../components/register-form.component';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
          <p className="text-gray-600 mt-2">
            {mode === 'login' 
              ? 'Sign in to your account' 
              : 'Create a new account'}
          </p>
        </div>

        {mode === 'login' ? (
          <LoginForm />
        ) : (
          <RegisterForm />
        )}

        <div className="mt-4 text-center">
          {mode === 'login' ? (
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Register
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  error?: Error;
  onReset?: () => void;
}

export function ErrorFallback({
  title = 'Algo deu errado',
  message = 'Ocorreu um erro inesperado. Por favor, tente novamente.',
  error,
  onReset,
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
        {error && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4 font-mono">
            {error.message}
          </p>
        )}
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </button>
        )}
      </div>
    </div>
  );
}

export function createErrorFallback(onReset?: () => void) {
  return function Fallback({ error }: { error?: Error }) {
    return <ErrorFallback error={error} onReset={onReset} />;
  };
}

import { Toaster as SonnerToaster } from 'sonner';

export type ToasterPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center';

export type ToasterType = 'success' | 'error' | 'warning' | 'info';

type ToasterProps = {
  position?: ToasterPosition;
};

export function Toaster({ position = 'top-right' }: ToasterProps) {
  return (
    <SonnerToaster
      position={position}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          backgroundColor: '#fff',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
      }}
    />
  );
}

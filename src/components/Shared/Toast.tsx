'use client';

import { useUIStore } from '@/store/useUIStore';

const TOAST_STYLES = {
  xp: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300',
  system: 'bg-bg-tertiary border-border-medium text-text-primary',
  penalty: 'bg-red-500/20 border-red-500/40 text-red-300',
  success: 'bg-green-500/20 border-green-500/40 text-green-300',
  error: 'bg-red-500/20 border-red-500/40 text-red-300',
};

export default function ToastContainer() {
  const toasts = useUIStore(s => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-xl border text-sm font-medium text-center animate-slide-up ${TOAST_STYLES[toast.type]}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

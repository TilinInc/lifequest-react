'use client';

import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    full: 'max-w-full mx-4',
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizeClasses[size]} bg-bg-secondary rounded-t-2xl sm:rounded-2xl border border-border-subtle max-h-[85vh] overflow-y-auto animate-slide-up`}>
        {title && (
          <div className="sticky top-0 flex items-center justify-between px-5 py-4 border-b border-border-subtle bg-bg-secondary/95 backdrop-blur-sm rounded-t-2xl">
            <h2 className="font-bold text-lg">{title}</h2>
            <button onClick={onClose} className="text-text-muted hover:text-text-primary text-xl p-1">â</button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`pointer-events-auto min-w-[300px] max-w-md w-full p-4 rounded-xl shadow-2xl border flex items-start gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 transform transition-all
              ${toast.type === 'success' ? 'bg-white dark:bg-slate-900 border-green-500/50 text-slate-900 dark:text-white' : ''}
              ${toast.type === 'error' ? 'bg-white dark:bg-slate-900 border-red-500/50 text-slate-900 dark:text-white' : ''}
              ${toast.type === 'info' ? 'bg-white dark:bg-slate-900 border-blue-500/50 text-slate-900 dark:text-white' : ''}
            `}
          >
            <div className="shrink-0 mt-0.5">
                {toast.type === 'success' && <CheckCircle className="text-green-500" size={20} />}
                {toast.type === 'error' && <AlertCircle className="text-red-500" size={20} />}
                {toast.type === 'info' && <Info className="text-blue-500" size={20} />}
            </div>
            <p className="text-sm font-medium leading-relaxed flex-1">{toast.message}</p>
            <button 
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
                <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

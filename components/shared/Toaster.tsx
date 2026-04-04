'use client';
import { useUIStore } from '@/store/ui-store';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-400" />,
  error: <XCircle className="w-5 h-5 text-crimson-light" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-gold" />,
};

export function Toaster() {
  const { toasts, dismissToast } = useUIStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="glass rounded-xl p-4 flex items-start gap-3 animate-slide-up pointer-events-auto"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
        >
          {icons[toast.type]}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[--text-primary]">{toast.title}</p>
            {toast.message && <p className="text-xs text-[--text-muted] mt-0.5">{toast.message}</p>}
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-[--text-muted] hover:text-[--text-primary] transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

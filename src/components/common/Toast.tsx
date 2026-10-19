import React from 'react';
import { useData } from '../../context/DataContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, clearToast } = useData();

  if (!toastMessage) return null;

  const bgStyle =
    toastMessage.type === 'success'
      ? 'bg-slate-900 text-white border-emerald-500'
      : toastMessage.type === 'error'
      ? 'bg-red-900 text-white border-red-500'
      : 'bg-slate-900 text-white border-blue-500';

  return (
    <div
      id="global-toast"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl border-l-4 transition-all animate-slideUp max-w-md text-sm"
    >
      <div className={bgStyle + ' p-3 rounded-lg flex items-center gap-3 shadow-lg border'}>
        {toastMessage.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
        {toastMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
        {toastMessage.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
        <span className="font-medium">{toastMessage.text}</span>
        <button
          onClick={clearToast}
          className="ml-2 text-slate-400 hover:text-white p-1 transition-colors"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer = Toast;

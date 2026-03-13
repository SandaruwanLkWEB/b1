import { PropsWithChildren } from 'react';

export default function Modal({ open, title, onClose, children }: PropsWithChildren<{ open: boolean; title: string; onClose: () => void }>) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="card w-full max-w-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="btn-secondary px-3 py-1.5" onClick={onClose}>Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}

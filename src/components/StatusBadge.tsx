import { titleCase } from '../lib/utils';

const palette: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  SUBMITTED: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
  ADMIN_APPROVED: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
  ADMIN_REJECTED: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300',
  TA_PROCESSING: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300',
  TA_COMPLETED: 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300',
  HR_APPROVED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
  HR_REJECTED: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300',
  ACTIVE: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
  SUSPENDED: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300',
  PENDING_HOD: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
  PENDING_ADMIN: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
};

export default function StatusBadge({ status }: { status?: string | null }) {
  if (!status) return <span className="text-slate-400">-</span>;
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${palette[status] || 'bg-slate-100 text-slate-700'}`}>
      {titleCase(status)}
    </span>
  );
}

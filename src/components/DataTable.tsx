import { ReactNode } from 'react';
import EmptyState from './EmptyState';

interface Column<T> {
  key: string;
  title: string;
  render: (row: T) => ReactNode;
}

export default function DataTable<T extends { id?: number | string }>({ columns, rows }: { columns: Column<T>[]; rows: T[] }) {
  if (!rows.length) return <EmptyState title="No records" message="Nothing matches the current filter." />;

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-900/70">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((row, index) => (
              <tr key={row.id ?? index} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/60">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react'
import DataTable from '../components/DataTable'
import SectionHeader from '../components/SectionHeader'
import api from '../lib/api'

export default function ArchivePage() {
  const [data, setData] = useState<any>({ daily: [], monthly: [], exports: [] })
  const [runDate, setRunDate] = useState('')
  const [yearMonth, setYearMonth] = useState('')

  const load = async () => {
    const response = await api.get('/archive')
    setData(response.data.data || { daily: [], monthly: [], exports: [] })
  }

  useEffect(() => {
    load().catch(() => undefined)
  }, [])

  return (
    <div className="space-y-6">
      <SectionHeader title="Archive & close" subtitle="Close daily and monthly operational cycles." />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <SectionHeader title="Daily close" />
          <div className="flex gap-3">
            <input
              type="date"
              value={runDate}
              onChange={(e) => setRunDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
            />
            <button
              type="button"
              className="rounded-xl bg-slate-900 px-4 py-2 text-white dark:bg-slate-100 dark:text-slate-900"
              onClick={async () => {
                await api.post(`/archive/daily-close/${runDate}`, { note: 'Closed from UI' })
                await load()
              }}
            >
              Close day
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <SectionHeader title="Monthly close" />
          <div className="flex gap-3">
            <input
              type="month"
              value={yearMonth}
              onChange={(e) => setYearMonth(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
            />
            <button
              type="button"
              className="rounded-xl bg-slate-900 px-4 py-2 text-white dark:bg-slate-100 dark:text-slate-900"
              onClick={async () => {
                await api.post(`/archive/monthly-close/${yearMonth}`, { note: 'Closed from UI' })
                await load()
              }}
            >
              Close month
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 xl:col-span-1">
          <SectionHeader title="Daily closes" />
          <DataTable<any>
            rows={data?.daily || []}
            columns={[
              { key: 'run_date', title: 'Run date', render: (row) => row?.run_date || '-' },
              { key: 'note', title: 'Note', render: (row) => row?.note || '-' },
              { key: 'created_at', title: 'Created', render: (row) => (row?.created_at ? new Date(row.created_at).toLocaleString() : '-') },
            ]}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 xl:col-span-1">
          <SectionHeader title="Monthly closes" />
          <DataTable<any>
            rows={data?.monthly || []}
            columns={[
              { key: 'year_month', title: 'Month', render: (row) => row?.year_month || '-' },
              { key: 'note', title: 'Note', render: (row) => row?.note || '-' },
              { key: 'created_at', title: 'Created', render: (row) => (row?.created_at ? new Date(row.created_at).toLocaleString() : '-') },
            ]}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 xl:col-span-1">
          <SectionHeader title="Archive exports" />
          <DataTable<any>
            rows={data?.exports || []}
            columns={[
              { key: 'export_type', title: 'Type', render: (row) => row?.export_type || '-' },
              { key: 'file_name', title: 'File', render: (row) => row?.file_name || '-' },
              { key: 'created_at', title: 'Created', render: (row) => (row?.created_at ? new Date(row.created_at).toLocaleString() : '-') },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

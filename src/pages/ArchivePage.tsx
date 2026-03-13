import { useEffect, useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import DataTable from '../components/DataTable';
import api from '../lib/api';

export default function ArchivePage() {
  const [data, setData] = useState<any>({ daily: [], monthly: [], exports: [] });
  const [runDate, setRunDate] = useState('');
  const [yearMonth, setYearMonth] = useState('');

  const load = async () => setData((await api.get('/archive')).data.data);
  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <SectionHeader title="Backup, archive & month close" subtitle="Freeze operational records safely for audit-friendly history and reporting" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-5">
          <h3 className="text-lg font-semibold">Daily close</h3>
          <div className="mt-4 flex gap-3">
            <input type="date" className="input" value={runDate} onChange={(e) => setRunDate(e.target.value)} />
            <button className="btn-primary" onClick={async () => { await api.post(`/archive/daily-close/${runDate}`, { note: 'Closed from UI' }); load(); }}>Close day</button>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="text-lg font-semibold">Monthly close</h3>
          <div className="mt-4 flex gap-3">
            <input type="month" className="input" value={yearMonth} onChange={(e) => setYearMonth(e.target.value)} />
            <button className="btn-primary" onClick={async () => { await api.post(`/archive/monthly-close/${yearMonth}`, { note: 'Closed from UI' }); load(); }}>Close month</button>
          </div>
        </div>
      </div>

      <DataTable rows={data.daily || []} columns={[
        { key: 'run_date', title: 'Run date', render: (row) => row.run_date },
        { key: 'note', title: 'Note', render: (row) => row.note || '-' },
        { key: 'created_at', title: 'Created', render: (row) => new Date(row.created_at).toLocaleString() },
      ]} />
      <DataTable rows={data.monthly || []} columns={[
        { key: 'year_month', title: 'Month', render: (row) => row.year_month },
        { key: 'note', title: 'Note', render: (row) => row.note || '-' },
        { key: 'created_at', title: 'Created', render: (row) => new Date(row.created_at).toLocaleString() },
      ]} />
    </div>
  );
}

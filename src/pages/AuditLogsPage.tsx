import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import SectionHeader from '../components/SectionHeader';
import api from '../lib/api';

export default function AuditLogsPage() {
  const [rows, setRows] = useState<any[]>([]);

  const load = async () => {
    const { data } = await api.get('/audit-logs', { params: { limit: 200 } });
    setRows(data.data);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <SectionHeader title="Audit Logs" subtitle="Recent operational actions captured for traceability" />
      <DataTable rows={rows} columns={[
        { key: 'created_at', title: 'Time', render: (row) => new Date(row.created_at).toLocaleString() },
        { key: 'actor_name', title: 'Actor', render: (row) => row.actor_name || row.actor_email || 'System' },
        { key: 'entity_type', title: 'Entity', render: (row) => row.entity_type },
        { key: 'action', title: 'Action', render: (row) => row.action },
        { key: 'entity_id', title: 'ID', render: (row) => row.entity_id || '-' },
        { key: 'detail', title: 'Detail', render: (row) => <pre className="max-w-xs overflow-auto whitespace-pre-wrap text-xs text-slate-500">{JSON.stringify(row.detail, null, 2)}</pre> },
      ]} />
    </div>
  );
}

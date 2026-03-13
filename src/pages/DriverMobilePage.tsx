import { useState } from 'react';
import DataTable from '../components/DataTable';
import SectionHeader from '../components/SectionHeader';
import api from '../lib/api';

export default function DriverMobilePage() {
  const [groupId, setGroupId] = useState('');
  const [data, setData] = useState<any>(null);

  const load = async () => {
    if (!groupId) return;
    setData((await api.get(`/driver-ops/manifest/${groupId}`)).data.data);
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Driver mobile panel" subtitle="Manifest, boarding tracking, and incident reporting for assigned overtime trips" />
      <div className="card flex flex-col gap-3 p-5 md:flex-row">
        <input className="input" placeholder="Generated group ID" value={groupId} onChange={(e) => setGroupId(e.target.value)} />
        <button className="btn-primary" onClick={load}>Load manifest</button>
      </div>
      {data?.group ? (
        <div className="card p-5">
          <div className="grid gap-3 md:grid-cols-2">
            <div><p className="text-sm text-slate-500">Group</p><p className="font-semibold">{data.group.group_code}</p></div>
            <div><p className="text-sm text-slate-500">Vehicle</p><p className="font-semibold">{data.group.registration_no || '-'}</p></div>
            <div><p className="text-sm text-slate-500">Driver</p><p className="font-semibold">{data.group.driver_name || '-'}</p></div>
            <div><p className="text-sm text-slate-500">Driver phone</p><p className="font-semibold">{data.group.driver_phone || '-'}</p></div>
          </div>
        </div>
      ) : null}
      <DataTable rows={data?.members || []} columns={[
        { key: 'pickup_sequence', title: '#', render: (row) => row.pickup_sequence },
        { key: 'emp_no', title: 'Emp No', render: (row) => row.emp_no },
        { key: 'full_name', title: 'Passenger', render: (row) => row.full_name },
        { key: 'phone', title: 'Phone', render: (row) => row.phone || '-' },
        { key: 'place_title', title: 'Place', render: (row) => row.place_title || '-' },
      ]} />
    </div>
  );
}

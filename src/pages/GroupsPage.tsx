import { FormEvent, useEffect, useMemo, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import SectionHeader from '../components/SectionHeader';
import StatusBadge from '../components/StatusBadge';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function GroupsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<string>('');
  const [runs, setRuns] = useState<any[]>([]);
  const [details, setDetails] = useState<any>({ groups: [], members: [] });
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<any | null>(null);
  const [form, setForm] = useState({ vehicleId: '', driverId: '', note: '' });

  const loadRequests = async () => {
    const [requestRes, vehicleRes, driverRes] = await Promise.all([
      api.get('/transport-requests'),
      api.get('/vehicles'),
      api.get('/drivers'),
    ]);
    setRequests(requestRes.data.data);
    setVehicles(vehicleRes.data.data);
    setDrivers(driverRes.data.data);
  };

  useEffect(() => { loadRequests(); }, []);

  const loadRuns = async (requestId: string) => {
    if (!requestId) return;
    const { data } = await api.get(`/grouping/request/${requestId}/runs`);
    setRuns(data.data);
    if (data.data[0]) {
      const detail = await api.get(`/grouping/run/${data.data[0].id}`);
      setDetails(detail.data.data);
    } else {
      setDetails({ groups: [], members: [] });
    }
  };

  const memberMap = useMemo(() => {
    const grouped: Record<number, any[]> = {};
    for (const item of details.members || []) {
      if (!grouped[item.generated_group_id]) grouped[item.generated_group_id] = [];
      grouped[item.generated_group_id].push(item);
    }
    return grouped;
  }, [details.members]);

  const submitAssign = async (event: FormEvent) => {
    event.preventDefault();
    if (!currentGroup) return;
    await api.post(`/grouping/groups/${currentGroup.id}/assign`, {
      vehicleId: Number(form.vehicleId),
      driverId: Number(form.driverId),
      note: form.note,
    });
    setModal(false);
    setCurrentGroup(null);
    setForm({ vehicleId: '', driverId: '', note: '' });
    loadRuns(selectedRequest);
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Generated Groups" subtitle="Inspect corridor-based grouping snapshots, exceptions, and auto vehicle recommendations" />
      <div className="grid gap-4 md:grid-cols-[320px_1fr]">
        <div className="card p-4">
          <label className="label">Request</label>
          <select className="input" value={selectedRequest} onChange={(e) => { setSelectedRequest(e.target.value); loadRuns(e.target.value); }}>
            <option value="">Select request</option>
            {requests.map((item) => <option key={item.id} value={item.id}>{item.request_code} · {item.status}</option>)}
          </select>
          <div className="mt-4 space-y-3">
            {runs.map((run) => (
              <button key={run.id} className="w-full rounded-2xl border border-slate-200 p-3 text-left dark:border-slate-800" onClick={async () => setDetails((await api.get(`/grouping/run/${run.id}`)).data.data)}>
                <p className="font-medium">Run #{run.run_no}</p>
                <p className="text-sm text-slate-500">{run.algorithm_version} · {run.active ? 'Active' : 'Archived'}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <DataTable rows={details.groups || []} columns={[
            { key: 'group_code', title: 'Group', render: (row) => row.group_code },
            { key: 'route_name', title: 'Route', render: (row) => row.route_name || '-' },
            { key: 'employee_count', title: 'Employees', render: (row) => row.employee_count },
            { key: 'vehicle', title: 'Vehicle', render: (row) => row.registration_no || row.recommended_vehicle_registration || '-' },
            { key: 'driver', title: 'Driver', render: (row) => row.driver_name || '-' },
            { key: 'status', title: 'Status', render: (row) => <div className='space-y-1'><StatusBadge status={row.status} />{row.overflow_allowed ? <p className='text-xs text-amber-600'>Overflow +{row.overflow_count}</p> : null}</div> },
            { key: 'actions', title: 'Actions', render: (row) => (user?.role === 'TRANSPORT_AUTHORITY' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') ? <button className="btn-secondary" onClick={() => { setCurrentGroup(row); setModal(true); }}>Assign</button> : null },
          ]} />
          {(details.groups || []).map((group: any) => (
            <div key={group.id} className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{group.group_code}</h3>
                  <p className="text-sm text-slate-500">{group.cluster_note}</p><p className="text-xs text-slate-500">Recommended: {group.recommended_vehicle_registration || 'manual'} · {group.recommendation_reason || 'No reason saved'}</p>
                </div>
                <StatusBadge status={group.status} />
              </div>
              <div className="mt-3 space-y-2">
                {(memberMap[group.id] || []).map((member) => (
                  <div key={member.id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-900">
                    #{member.pickup_sequence} · {member.emp_no} · {member.full_name} · {member.place_title || 'Direct coordinate'}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal open={modal} title={`Assign ${currentGroup?.group_code || ''}`} onClose={() => setModal(false)}>
        <form className="space-y-4" onSubmit={submitAssign}>
          <div><label className="label">Vehicle</label><select className="input" value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}><option value="">Select vehicle</option>{vehicles.map((item) => <option key={item.id} value={item.id}>{item.registration_no} · capacity {item.capacity}</option>)}</select></div>
          <div><label className="label">Driver</label><select className="input" value={form.driverId} onChange={(e) => setForm({ ...form, driverId: e.target.value })}><option value="">Select driver</option>{drivers.map((item) => <option key={item.id} value={item.id}>{item.full_name}</option>)}</select></div>
          <div><label className="label">Note</label><textarea className="input min-h-24" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></div>
          <button className="btn-primary">Save assignment</button>
        </form>
      </Modal>
    </div>
  );
}

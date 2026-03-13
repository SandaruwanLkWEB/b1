import { FormEvent, useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import SectionHeader from '../components/SectionHeader';
import api from '../lib/api';

export default function VehiclesPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ registrationNo: '', capacity: '30', type: 'BUS', active: true });

  const load = async () => setRows((await api.get('/vehicles')).data.data);
  useEffect(() => { load(); }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = { ...form, capacity: Number(form.capacity) };
    if (editing) await api.patch(`/vehicles/${editing.id}`, payload); else await api.post('/vehicles', payload);
    setOpen(false); setEditing(null); setForm({ registrationNo: '', capacity: '30', type: 'BUS', active: true });
    load();
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Vehicles" subtitle="Capacity-aware operational fleet master" action={<button className="btn-primary" onClick={() => setOpen(true)}>New vehicle</button>} />
      <DataTable rows={rows} columns={[
        { key: 'registration_no', title: 'Registration', render: (row) => row.registration_no },
        { key: 'type', title: 'Type', render: (row) => row.type },
        { key: 'capacity', title: 'Capacity', render: (row) => row.capacity },
        { key: 'actions', title: 'Actions', render: (row) => <button className="btn-secondary" onClick={() => { setEditing(row); setForm({ registrationNo: row.registration_no, capacity: String(row.capacity), type: row.type, active: row.active }); setOpen(true); }}>Edit</button> },
      ]} />
      <Modal open={open} title={editing ? 'Edit vehicle' : 'Create vehicle'} onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={submit}>
          <div><label className="label">Registration No</label><input className="input" value={form.registrationNo} onChange={(e) => setForm({ ...form, registrationNo: e.target.value })} /></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="label">Capacity</label><input className="input" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></div>
            <div><label className="label">Type</label><input className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} /></div>
          </div>
          <button className="btn-primary">Save</button>
        </form>
      </Modal>
    </div>
  );
}

import { FormEvent, useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import SectionHeader from '../components/SectionHeader';
import api from '../lib/api';

export default function RoutesPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ code: '', name: '', depotLat: '', depotLng: '', active: true });

  const load = async () => setRows((await api.get('/routes')).data.data);
  useEffect(() => { load(); }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = { ...form, depotLat: form.depotLat ? Number(form.depotLat) : undefined, depotLng: form.depotLng ? Number(form.depotLng) : undefined };
    if (editing) await api.patch(`/routes/${editing.id}`, payload); else await api.post('/routes', payload);
    setOpen(false); setEditing(null); setForm({ code: '', name: '', depotLat: '', depotLng: '', active: true });
    load();
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Routes" subtitle="Master routes with optional depot coordinates" action={<button className="btn-primary" onClick={() => setOpen(true)}>New route</button>} />
      <DataTable rows={rows} columns={[
        { key: 'code', title: 'Code', render: (row) => row.code },
        { key: 'name', title: 'Name', render: (row) => row.name },
        { key: 'depot', title: 'Depot', render: (row) => row.depot_lat ? `${row.depot_lat}, ${row.depot_lng}` : '-' },
        { key: 'actions', title: 'Actions', render: (row) => <button className="btn-secondary" onClick={() => { setEditing(row); setForm({ code: row.code, name: row.name, depotLat: row.depot_lat || '', depotLng: row.depot_lng || '', active: row.active }); setOpen(true); }}>Edit</button> },
      ]} />
      <Modal open={open} title={editing ? 'Edit route' : 'Create route'} onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={submit}>
          <div><label className="label">Code</label><input className="input" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></div>
          <div><label className="label">Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="label">Depot latitude</label><input className="input" value={form.depotLat} onChange={(e) => setForm({ ...form, depotLat: e.target.value })} /></div>
            <div><label className="label">Depot longitude</label><input className="input" value={form.depotLng} onChange={(e) => setForm({ ...form, depotLng: e.target.value })} /></div>
          </div>
          <button className="btn-primary">Save</button>
        </form>
      </Modal>
    </div>
  );
}

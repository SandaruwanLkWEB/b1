import { FormEvent, useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import SectionHeader from '../components/SectionHeader';
import api from '../lib/api';

export default function DriversPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ fullName: '', phone: '', licenseNo: '' });

  const load = async () => setRows((await api.get('/drivers')).data.data);
  useEffect(() => { load(); }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (editing) await api.patch(`/drivers/${editing.id}`, form); else await api.post('/drivers', form);
    setOpen(false); setEditing(null); setForm({ fullName: '', phone: '', licenseNo: '' });
    load();
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Drivers" subtitle="Driver master for operational assignment" action={<button className="btn-primary" onClick={() => setOpen(true)}>New driver</button>} />
      <DataTable rows={rows} columns={[
        { key: 'full_name', title: 'Driver', render: (row) => row.full_name },
        { key: 'phone', title: 'Phone', render: (row) => row.phone },
        { key: 'license_no', title: 'License', render: (row) => row.license_no || '-' },
        { key: 'actions', title: 'Actions', render: (row) => <button className="btn-secondary" onClick={() => { setEditing(row); setForm({ fullName: row.full_name, phone: row.phone, licenseNo: row.license_no || '' }); setOpen(true); }}>Edit</button> },
      ]} />
      <Modal open={open} title={editing ? 'Edit driver' : 'Create driver'} onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={submit}>
          <div><label className="label">Full name</label><input className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className="label">License No</label><input className="input" value={form.licenseNo} onChange={(e) => setForm({ ...form, licenseNo: e.target.value })} /></div>
          <button className="btn-primary">Save</button>
        </form>
      </Modal>
    </div>
  );
}

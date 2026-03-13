import { FormEvent, useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import SectionHeader from '../components/SectionHeader';
import api from '../lib/api';

export default function DepartmentsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ code: '', name: '', active: true });

  const load = async () => {
    const { data } = await api.get('/departments');
    setRows(data.data);
  };

  useEffect(() => { load(); }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (editing) await api.patch(`/departments/${editing.id}`, form);
    else await api.post('/departments', form);
    setOpen(false); setEditing(null); setForm({ code: '', name: '', active: true });
    load();
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Departments" subtitle="Master data for department ownership and approvals" action={<button className="btn-primary" onClick={() => setOpen(true)}>New department</button>} />
      <DataTable rows={rows} columns={[
        { key: 'code', title: 'Code', render: (row) => row.code },
        { key: 'name', title: 'Name', render: (row) => row.name },
        { key: 'active', title: 'Active', render: (row) => row.active ? 'Yes' : 'No' },
        { key: 'actions', title: 'Actions', render: (row) => <button className="btn-secondary" onClick={() => { setEditing(row); setForm({ code: row.code, name: row.name, active: row.active }); setOpen(true); }}>Edit</button> },
      ]} />
      <Modal open={open} title={editing ? 'Edit department' : 'Create department'} onClose={() => { setOpen(false); setEditing(null); }}>
        <form className="space-y-4" onSubmit={submit}>
          <div><label className="label">Code</label><input className="input" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></div>
          <div><label className="label">Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
          <button className="btn-primary">Save</button>
        </form>
      </Modal>
    </div>
  );
}

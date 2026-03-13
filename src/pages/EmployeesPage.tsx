import { FormEvent, useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import SectionHeader from '../components/SectionHeader';
import StatusBadge from '../components/StatusBadge';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function EmployeesPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>({
    empNo: '', fullName: '', departmentId: '', phone: '', email: '', placeId: '', preferredRouteId: '', gnDivisionId: '', accountPassword: '',
  });

  const load = async () => {
    const [employeesRes, deptRes, routeRes, placeRes] = await Promise.all([
      api.get('/employees', { params: { search } }),
      api.get('/departments'),
      api.get('/routes'),
      api.get('/places'),
    ]);
    setRows(employeesRes.data.data);
    setDepartments(deptRes.data.data);
    setRoutes(routeRes.data.data);
    setPlaces(placeRes.data.data);
    if (user?.role === 'HOD' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
      const pendingRes = await api.get('/employees/pending/self-registrations');
      setPending(pendingRes.data.data);
    }
  };

  useEffect(() => { load(); }, [search]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      ...form,
      departmentId: Number(form.departmentId),
      placeId: form.placeId ? Number(form.placeId) : undefined,
      preferredRouteId: form.preferredRouteId ? Number(form.preferredRouteId) : undefined,
      gnDivisionId: form.gnDivisionId ? Number(form.gnDivisionId) : undefined,
    };
    if (editing) await api.patch(`/employees/${editing.id}`, payload); else await api.post('/employees', payload);
    setOpen(false); setEditing(null);
    setForm({ empNo: '', fullName: '', departmentId: '', phone: '', email: '', placeId: '', preferredRouteId: '', gnDivisionId: '', accountPassword: '' });
    load();
  };

  const approvePending = async (id: number) => {
    await api.post(`/employees/${id}/approve-self-registration`, {});
    load();
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Employees" subtitle="Department-bound employee directory and approval queue" action={(user?.role === 'HOD' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') ? <button className="btn-primary" onClick={() => setOpen(true)}>New employee</button> : null} />
      <input className="input max-w-sm" placeholder="Search employee by name, number or email" value={search} onChange={(e) => setSearch(e.target.value)} />
      <DataTable rows={rows} columns={[
        { key: 'emp_no', title: 'Emp No', render: (row) => row.emp_no },
        { key: 'full_name', title: 'Name', render: (row) => row.full_name },
        { key: 'department_name', title: 'Department', render: (row) => row.department_name },
        { key: 'route_name', title: 'Preferred Route', render: (row) => row.route_name || '-' },
        { key: 'place_title', title: 'Place', render: (row) => row.place_title || '-' },
        { key: 'active', title: 'Status', render: (row) => <StatusBadge status={row.active ? 'ACTIVE' : 'SUSPENDED'} /> },
        { key: 'actions', title: 'Actions', render: (row) => (user?.role === 'EMP' ? null : <button className="btn-secondary" onClick={() => { setEditing(row); setForm({ empNo: row.emp_no, fullName: row.full_name, departmentId: row.department_id, phone: row.phone || '', email: row.email || '', placeId: row.place_id || '', preferredRouteId: row.preferred_route_id || '', gnDivisionId: row.gn_division_id || '', accountPassword: '' }); setOpen(true); }}>Edit</button>) },
      ]} />

      {pending.length ? (
        <div className="card p-5">
          <h3 className="text-lg font-semibold">Pending self-registrations</h3>
          <div className="mt-4 space-y-3">
            {pending.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between dark:border-slate-800">
                <div>
                  <p className="font-medium">{item.full_name}</p>
                  <p className="text-sm text-slate-500">{item.emp_no} · {item.department_name}</p>
                </div>
                <button className="btn-primary" onClick={() => approvePending(item.id)}>Approve</button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <Modal open={open} title={editing ? 'Edit employee' : 'Create employee'} onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="label">Employee No</label><input disabled={!!editing} className="input" value={form.empNo} onChange={(e) => setForm({ ...form, empNo: e.target.value })} /></div>
            <div><label className="label">Full name</label><input className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label">Department</label>
              <select className="input" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>
                <option value="">Select</option>
                {departments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Preferred route</label>
              <select className="input" value={form.preferredRouteId} onChange={(e) => setForm({ ...form, preferredRouteId: e.target.value })}>
                <option value="">Select</option>
                {routes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div><label className="label">Email</label><input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          </div>
          <div>
            <label className="label">Place</label>
            <select className="input" value={form.placeId} onChange={(e) => setForm({ ...form, placeId: e.target.value })}>
              <option value="">Select</option>
              {places.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>
          </div>
          {!editing ? <div><label className="label">Initial account password (optional)</label><input className="input" type="password" value={form.accountPassword} onChange={(e) => setForm({ ...form, accountPassword: e.target.value })} /></div> : null}
          <button className="btn-primary">Save</button>
        </form>
      </Modal>
    </div>
  );
}

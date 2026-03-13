import { FormEvent, useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import SectionHeader from '../components/SectionHeader';
import StatusBadge from '../components/StatusBadge';
import api from '../lib/api';
import { formatDate } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export default function RequestsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [status, setStatus] = useState('');
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detail, setDetail] = useState<any | null>(null);
  const [form, setForm] = useState<any>({ requestDate: '', departmentId: '', notes: '', employeeIds: [] as number[] });

  const load = async () => {
    const requestRes = await api.get('/transport-requests', { params: { status: status || undefined } });
    setRows(requestRes.data.data);
    if (user?.role === 'HOD' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
      const [employeeRes, deptRes] = await Promise.all([api.get('/employees'), api.get('/departments')]);
      setEmployees(employeeRes.data.data);
      setDepartments(deptRes.data.data);
    }
  };

  useEffect(() => { load(); }, [status]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = { ...form, departmentId: form.departmentId ? Number(form.departmentId) : undefined };
    await api.post('/transport-requests', payload);
    setOpen(false); setForm({ requestDate: '', departmentId: '', notes: '', employeeIds: [] });
    load();
  };

  const action = async (url: string) => { await api.post(url, {}); load(); };
  const viewRequest = async (id: number) => { const { data } = await api.get(`/transport-requests/${id}`); setDetail(data.data); setDetailOpen(true); };

  return (
    <div className="space-y-6">
      <SectionHeader title="Transport Requests" subtitle="Create, trace, approve, and finalize transport batches" action={(user?.role === 'HOD' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') ? <button className="btn-primary" onClick={() => setOpen(true)}>Create request</button> : null} />
      <select className="input max-w-xs" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All statuses</option>
        {['DRAFT','SUBMITTED','ADMIN_APPROVED','TA_PROCESSING','TA_COMPLETED','HR_APPROVED','HR_REJECTED','CANCELLED'].map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <DataTable rows={rows} columns={[
        { key: 'request_code', title: 'Request', render: (row) => row.request_code },
        { key: 'date', title: 'Date', render: (row) => formatDate(row.request_date) },
        { key: 'department_name', title: 'Department', render: (row) => row.department_name },
        { key: 'employee_count', title: 'Employees', render: (row) => row.employee_count },
        { key: 'status', title: 'Status', render: (row) => <StatusBadge status={row.status} /> },
        { key: 'actions', title: 'Actions', render: (row) => (
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => viewRequest(row.id)}>View</button>
            {(user?.role === 'HOD' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && row.status === 'DRAFT' ? <button className="btn-secondary" onClick={() => action(`/transport-requests/${row.id}/submit`)}>Submit</button> : null}
            {(user?.role === 'HOD' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && ['DRAFT','SUBMITTED'].includes(row.status) && !row.daily_run_locked ? <button className="btn-secondary" onClick={() => action(`/transport-requests/${row.id}/cancel`)}>Cancel</button> : null}
            {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && row.status === 'SUBMITTED' ? <>
              <button className="btn-secondary" onClick={() => action(`/transport-requests/${row.id}/admin-decision?approve=true`)}>Approve</button>
              <button className="btn-secondary" onClick={() => action(`/transport-requests/${row.id}/admin-decision?approve=false`)}>Reject</button>
            </> : null}
            {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && row.status !== 'HR_APPROVED' && !row.daily_run_locked ? <button className="btn-secondary" onClick={() => action(`/transport-requests/${row.id}/lock`)}>Lock run</button> : null}
          </div>
        ) },
      ]} />

      <Modal open={detailOpen} title={detail?.request_code || 'Request details'} onClose={() => setDetailOpen(false)}>
        {detail ? <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-3 text-sm dark:bg-slate-900"><span className="block text-slate-500">Department</span><strong>{detail.department_name}</strong></div>
            <div className="rounded-2xl bg-slate-50 p-3 text-sm dark:bg-slate-900"><span className="block text-slate-500">Request date</span><strong>{formatDate(detail.request_date)}</strong></div>
            <div className="rounded-2xl bg-slate-50 p-3 text-sm dark:bg-slate-900"><span className="block text-slate-500">Status</span><strong>{detail.status}</strong></div>
          </div>
          <div>
            <h4 className="font-semibold">Employees</h4>
            <div className="mt-2 max-h-48 space-y-2 overflow-auto">
              {detail.employees?.map((employee: any) => <div key={employee.id} className="rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">{employee.emp_no} · {employee.full_name} · {employee.place_title || 'No place'} · {employee.route_name || 'No route'}</div>)}
            </div>
          </div>
          <div>
            <h4 className="font-semibold">Status history</h4>
            <div className="mt-2 space-y-2">
              {detail.history?.map((item: any) => <div key={item.id} className="rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">{item.to_status} · {item.action_by_name || 'System'} · {new Date(item.action_at).toLocaleString()} · {item.comment || 'No comment'}</div>)}
            </div>
          </div>
          <div>
            <h4 className="font-semibold">Generated groups</h4>
            <div className="mt-2 space-y-2">
              {detail.groups?.length ? detail.groups.map((group: any) => <div key={group.id} className="rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">{group.group_code} · {group.route_name || 'No route'} · {group.registration_no || 'No vehicle'} · {group.driver_name || 'No driver'}</div>) : <div className="rounded-xl border border-dashed border-slate-200 px-3 py-6 text-sm text-slate-500 dark:border-slate-800">No grouping snapshot yet.</div>}
            </div>
          </div>
        </div> : null}
      </Modal>

      <Modal open={open} title="Create transport request" onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="label">Request date</label><input className="input" type="date" value={form.requestDate} onChange={(e) => setForm({ ...form, requestDate: e.target.value })} /></div>
            {user?.role !== 'HOD' ? <div><label className="label">Department</label><select className="input" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })}><option value="">Select</option>{departments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div> : null}
          </div>
          <div><label className="label">Notes</label><textarea className="input min-h-24" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          <div>
            <label className="label">Employees</label>
            <div className="max-h-72 space-y-2 overflow-y-auto rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
              {employees.map((employee) => (
                <label key={employee.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.employeeIds.includes(employee.id)}
                    onChange={(e) => setForm((prev: any) => ({
                      ...prev,
                      employeeIds: e.target.checked ? [...prev.employeeIds, employee.id] : prev.employeeIds.filter((id: number) => id !== employee.id),
                    }))}
                  />
                  {employee.emp_no} · {employee.full_name}
                </label>
              ))}
            </div>
          </div>
          <button className="btn-primary">Save request</button>
        </form>
      </Modal>
    </div>
  );
}

import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import SectionHeader from '../components/SectionHeader';
import StatusBadge from '../components/StatusBadge';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function ApprovalsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<any[]>([]);

  const preferredStatus = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'
    ? 'SUBMITTED'
    : user?.role === 'TRANSPORT_AUTHORITY'
    ? 'ADMIN_APPROVED'
    : user?.role === 'HR'
    ? 'TA_COMPLETED'
    : '';

  const load = async () => {
    const { data } = await api.get('/transport-requests', { params: { status: preferredStatus || undefined } });
    setRows(data.data);
  };

  useEffect(() => { load(); }, [user?.role]);

  const action = async (url: string) => { await api.post(url, {}); load(); };

  return (
    <div className="space-y-6">
      <SectionHeader title="Approvals & Workflow" subtitle="Pending items for the current role stage" />
      <DataTable rows={rows} columns={[
        { key: 'request_code', title: 'Request', render: (row) => row.request_code },
        { key: 'department_name', title: 'Department', render: (row) => row.department_name },
        { key: 'employee_count', title: 'Employees', render: (row) => row.employee_count },
        { key: 'status', title: 'Status', render: (row) => <StatusBadge status={row.status} /> },
        { key: 'actions', title: 'Actions', render: (row) => (
          <div className="flex flex-wrap gap-2">
            {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && row.status === 'SUBMITTED' ? <>
              <button className="btn-primary" onClick={() => action(`/transport-requests/${row.id}/admin-decision?approve=true`)}>Approve</button>
              <button className="btn-secondary" onClick={() => action(`/transport-requests/${row.id}/admin-decision?approve=false`)}>Reject</button>
            </> : null}
            {user?.role === 'TRANSPORT_AUTHORITY' && ['ADMIN_APPROVED','HR_REJECTED'].includes(row.status) ? <button className="btn-primary" onClick={() => action(`/grouping/request/${row.id}/generate`)}>Generate groups</button> : null}
            {user?.role === 'TRANSPORT_AUTHORITY' && row.status === 'TA_PROCESSING' ? <button className="btn-primary" onClick={() => action(`/grouping/request/${row.id}/complete`)}>Submit to HR</button> : null}
            {user?.role === 'HR' && row.status === 'TA_COMPLETED' ? <>
              <button className="btn-primary" onClick={() => action(`/transport-requests/${row.id}/hr-decision?approve=true`)}>Final approve</button>
              <button className="btn-secondary" onClick={() => action(`/transport-requests/${row.id}/hr-decision?approve=false`)}>Reject</button>
            </> : null}
          </div>
        ) },
      ]} />
    </div>
  );
}

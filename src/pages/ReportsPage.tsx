import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import SectionHeader from '../components/SectionHeader';
import api from '../lib/api';

export default function ReportsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState('');
  const [printable, setPrintable] = useState<any>(null);
  const [costSummary, setCostSummary] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([api.get('/transport-requests'), api.get('/reports/cost-summary')]).then(([req, cost]) => {
      setRequests(req.data.data);
      setCostSummary(cost.data.data);
    });
  }, []);

  const load = async (requestId: string) => {
    setSelectedRequest(requestId);
    if (!requestId) return;
    setPrintable((await api.get(`/reports/printable-manifest/${requestId}`)).data.data);
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Reports" subtitle="Printable operational manifests, route-wise and vehicle-wise reports, and estimated cost summaries" />
      <div className="card p-5">
        <label className="label">Request</label>
        <select className="input" value={selectedRequest} onChange={(e) => load(e.target.value)}>
          <option value="">Select request</option>
          {requests.map((item) => <option key={item.id} value={item.id}>{item.request_code} · {item.status}</option>)}
        </select>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <DataTable rows={printable?.routeWise || []} columns={[
          { key: 'route_name', title: 'Route', render: (row) => row.route_name || '-' },
          { key: 'group_code', title: 'Group', render: (row) => row.group_code },
          { key: 'employee_name', title: 'Employee', render: (row) => row.employee_name },
          { key: 'vehicle_registration', title: 'Vehicle', render: (row) => row.vehicle_registration || '-' },
        ]} />
        <DataTable rows={printable?.vehicleWise || []} columns={[
          { key: 'registration_no', title: 'Vehicle', render: (row) => row.registration_no || '-' },
          { key: 'driver_name', title: 'Driver', render: (row) => row.driver_name || '-' },
          { key: 'group_code', title: 'Group', render: (row) => row.group_code },
          { key: 'employee_name', title: 'Employee', render: (row) => row.employee_name },
        ]} />
      </div>
      <DataTable rows={costSummary} columns={[
        { key: 'department_name', title: 'Department', render: (row) => row.department_name },
        { key: 'estimated_cost', title: 'Estimated Cost', render: (row) => row.estimated_cost },
      ]} />
      {printable?.totals ? (
        <div className="card p-5">
          <h3 className="text-lg font-semibold">Printable summary</h3>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div><p className="text-sm text-slate-500">Total estimated distance</p><p className="font-semibold">{printable.totals.total_km} km</p></div>
            <div><p className="text-sm text-slate-500">Total estimated cost</p><p className="font-semibold">{printable.totals.total_cost}</p></div>
          </div>
          <button className="btn-secondary mt-4" onClick={() => window.print()}>Print current page</button>
        </div>
      ) : null}
    </div>
  );
}

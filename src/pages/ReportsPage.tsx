import { useEffect, useState } from 'react'
import DataTable from '../components/DataTable'
import SectionHeader from '../components/SectionHeader'
import api from '../lib/api'

export default function ReportsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [selectedRequest, setSelectedRequest] = useState('')
  const [printable, setPrintable] = useState<any>(null)
  const [costSummary, setCostSummary] = useState<any[]>([])

  useEffect(() => {
    Promise.all([api.get('/transport-requests'), api.get('/reports/cost-summary')])
      .then(([reqRes, costRes]) => {
        setRequests(reqRes.data.data || [])
        setCostSummary(costRes.data.data || [])
      })
      .catch(() => undefined)
  }, [])

  const load = async (requestId: string) => {
    setSelectedRequest(requestId)
    if (!requestId) return
    const response = await api.get(`/reports/printable-manifest/${requestId}`)
    setPrintable(response.data.data)
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Reports" subtitle="Printable route, vehicle, and cost views." />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <label className="mb-2 block text-sm font-medium">Request</label>
        <select
          value={selectedRequest}
          onChange={(e) => load(e.target.value).catch(() => undefined)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
        >
          <option value="">Select request</option>
          {requests.map((item) => (
            <option key={item.id} value={item.id}>
              {item.request_code} · {item.status}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <SectionHeader title="Route-wise manifest" />
          <DataTable<any>
            rows={printable?.routeWise || printable?.route_wise || []}
            columns={[
              { key: 'route_name', title: 'Route', render: (row) => row?.route_name || '-' },
              { key: 'group_code', title: 'Group', render: (row) => row?.group_code || '-' },
              { key: 'employee_name', title: 'Employee', render: (row) => row?.employee_name || '-' },
              { key: 'vehicle_registration', title: 'Vehicle', render: (row) => row?.vehicle_registration || row?.registration_no || '-' },
            ]}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <SectionHeader title="Vehicle-wise manifest" />
          <DataTable<any>
            rows={printable?.vehicleWise || printable?.vehicle_wise || []}
            columns={[
              { key: 'registration_no', title: 'Vehicle', render: (row) => row?.registration_no || row?.vehicle_registration || '-' },
              { key: 'driver_name', title: 'Driver', render: (row) => row?.driver_name || '-' },
              { key: 'group_code', title: 'Group', render: (row) => row?.group_code || '-' },
              { key: 'employee_name', title: 'Employee', render: (row) => row?.employee_name || '-' },
            ]}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <SectionHeader title="Cost summary" subtitle="Department-level estimated cost summary." />
        <DataTable<any>
          rows={costSummary}
          columns={[
            { key: 'department_name', title: 'Department', render: (row) => row?.department_name || '-' },
            { key: 'estimated_cost', title: 'Estimated cost', render: (row) => row?.estimated_cost ?? row?.total_cost ?? 0 },
          ]}
        />
      </div>
    </div>
  )
}

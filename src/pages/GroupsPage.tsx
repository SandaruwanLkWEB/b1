import { FormEvent, useEffect, useMemo, useState } from 'react'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import SectionHeader from '../components/SectionHeader'
import StatusBadge from '../components/StatusBadge'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function GroupsPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<any[]>([])
  const [selectedRequest, setSelectedRequest] = useState('')
  const [runs, setRuns] = useState<any[]>([])
  const [details, setDetails] = useState<any>({ groups: [], members: [] })
  const [vehicles, setVehicles] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [modal, setModal] = useState(false)
  const [currentGroup, setCurrentGroup] = useState<any>(null)
  const [form, setForm] = useState({ vehicleId: '', driverId: '', note: '' })

  const loadRequests = async () => {
    const [requestRes, vehicleRes, driverRes] = await Promise.all([
      api.get('/transport-requests'),
      api.get('/vehicles'),
      api.get('/drivers'),
    ])
    setRequests(requestRes.data.data || [])
    setVehicles(vehicleRes.data.data || [])
    setDrivers(driverRes.data.data || [])
  }

  useEffect(() => {
    loadRequests().catch(() => undefined)
  }, [])

  const loadRuns = async (requestId: string) => {
    if (!requestId) return
    const response = await api.get(`/grouping/request/${requestId}/runs`)
    const runItems = response.data.data || []
    setRuns(runItems)

    if (runItems[0]) {
      const detail = await api.get(`/grouping/run/${runItems[0].id}`)
      setDetails(detail.data.data || { groups: [], members: [] })
    } else {
      setDetails({ groups: [], members: [] })
    }
  }

  const memberMap = useMemo(() => {
    const grouped: Record<string, any[]> = {}
    for (const item of details?.members || []) {
      const key = String(item.generated_group_id)
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(item)
    }
    return grouped
  }, [details])

  const submitAssign = async (event: FormEvent) => {
    event.preventDefault()
    if (!currentGroup) return

    await api.post(`/grouping/groups/${currentGroup.id}/assign`, {
      vehicleId: Number(form.vehicleId),
      driverId: Number(form.driverId),
      note: form.note,
    })

    setModal(false)
    setCurrentGroup(null)
    setForm({ vehicleId: '', driverId: '', note: '' })
    await loadRuns(selectedRequest)
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Generated groups" subtitle="Review saved grouping runs and assign vehicles/drivers." />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <label className="mb-2 block text-sm font-medium">Request</label>
        <select
          value={selectedRequest}
          onChange={(e) => {
            setSelectedRequest(e.target.value)
            loadRuns(e.target.value).catch(() => undefined)
          }}
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

      <div className="flex flex-wrap gap-3">
        {runs.map((run) => (
          <button
            key={run.id}
            type="button"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-left dark:border-slate-800 dark:bg-slate-900"
            onClick={async () => {
              const detail = await api.get(`/grouping/run/${run.id}`)
              setDetails(detail.data.data || { groups: [], members: [] })
            }}
          >
            <div className="font-medium">Run #{run.run_no}</div>
            <div className="text-xs text-slate-500">{run.algorithm_version} · {run.active ? 'Active' : 'Archived'}</div>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <DataTable<any>
          rows={details?.groups || []}
          columns={[
            { key: 'group_code', title: 'Group', render: (row) => row?.group_code || '-' },
            { key: 'route_name', title: 'Route', render: (row) => row?.route_name || '-' },
            { key: 'employee_count', title: 'Employees', render: (row) => row?.employee_count ?? 0 },
            {
              key: 'vehicle',
              title: 'Vehicle',
              render: (row) => row?.registration_no || row?.recommended_vehicle_registration || '-',
            },
            { key: 'driver', title: 'Driver', render: (row) => row?.driver_name || '-' },
            { key: 'status', title: 'Status', render: (row) => <StatusBadge status={row?.status} /> },
            {
              key: 'overflow',
              title: 'Overflow',
              render: (row) => (row?.overflow_allowed ? `Overflow +${row?.overflow_count ?? 0}` : '-'),
            },
            {
              key: 'actions',
              title: 'Actions',
              render: (row) =>
                user?.role === 'TRANSPORT_AUTHORITY' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? (
                  <button
                    type="button"
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white dark:bg-slate-100 dark:text-slate-900"
                    onClick={() => {
                      setCurrentGroup(row)
                      setModal(true)
                    }}
                  >
                    Assign
                  </button>
                ) : null,
            },
          ]}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {(details?.groups || []).map((group: any) => (
          <div key={group.id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-semibold">{group.group_code}</h3>
            <p className="text-sm text-slate-500">{group.cluster_note || '-'}</p>
            <p className="mt-2 text-sm">
              Recommended: {group.recommended_vehicle_registration || 'manual'} · {group.recommendation_reason || 'No reason saved'}
            </p>
            <div className="mt-3 space-y-2">
              {(memberMap[String(group.id)] || []).map((member: any) => (
                <div key={member.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/60">
                  #{member.pickup_sequence} · {member.emp_no} · {member.full_name} · {member.place_title || 'Direct coordinate'}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal open={modal} title="Assign group" onClose={() => setModal(false)}>
        <form className="space-y-4" onSubmit={submitAssign}>
          <div>
            <label className="mb-2 block text-sm font-medium">Vehicle</label>
            <select
              value={form.vehicleId}
              onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
            >
              <option value="">Select vehicle</option>
              {vehicles.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.registration_no} · capacity {item.capacity}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Driver</label>
            <select
              value={form.driverId}
              onChange={(e) => setForm({ ...form, driverId: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
            >
              <option value="">Select driver</option>
              {drivers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Note</label>
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-white dark:bg-slate-100 dark:text-slate-900">
            Save assignment
          </button>
        </form>
      </Modal>
    </div>
  )
}

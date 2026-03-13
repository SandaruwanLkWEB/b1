import { useState } from 'react'
import DataTable from '../components/DataTable'
import SectionHeader from '../components/SectionHeader'
import api from '../lib/api'

export default function DriverMobilePage() {
  const [groupId, setGroupId] = useState('')
  const [data, setData] = useState<any>(null)

  const load = async () => {
    if (!groupId) return
    const response = await api.get(`/driver-ops/manifest/${groupId}`)
    setData(response.data.data)
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Driver mobile" subtitle="Simple manifest view for operational use on mobile." />

      <div className="flex gap-3">
        <input
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          placeholder="Enter group id"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
        />
        <button type="button" onClick={load} className="rounded-xl bg-slate-900 px-4 py-2 text-white dark:bg-slate-100 dark:text-slate-900">
          Load manifest
        </button>
      </div>

      {data?.group ? (
        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <div className="text-xs uppercase text-slate-500">Group</div>
            <div className="text-lg font-semibold">{data.group.group_code}</div>
          </div>
          <div>
            <div className="text-xs uppercase text-slate-500">Vehicle</div>
            <div className="text-lg font-semibold">{data.group.registration_no || '-'}</div>
          </div>
          <div>
            <div className="text-xs uppercase text-slate-500">Driver</div>
            <div className="text-lg font-semibold">{data.group.driver_name || '-'}</div>
          </div>
          <div>
            <div className="text-xs uppercase text-slate-500">Driver phone</div>
            <div className="text-lg font-semibold">{data.group.driver_phone || '-'}</div>
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <SectionHeader title="Passengers" />
        <DataTable<any>
          rows={data?.members || []}
          columns={[
            { key: 'pickup_sequence', title: 'Seq', render: (row) => row?.pickup_sequence ?? '-' },
            { key: 'emp_no', title: 'Emp No', render: (row) => row?.emp_no || '-' },
            { key: 'full_name', title: 'Passenger', render: (row) => row?.full_name || '-' },
            { key: 'phone', title: 'Phone', render: (row) => row?.phone || '-' },
            { key: 'place_title', title: 'Place', render: (row) => row?.place_title || '-' },
          ]}
        />
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import DataTable from '../components/DataTable'
import SectionHeader from '../components/SectionHeader'
import StatCard from '../components/StatCard'
import api from '../lib/api'

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<any>(null)
  const [costs, setCosts] = useState<any>(null)

  useEffect(() => {
    Promise.all([api.get('/analytics/overview'), api.get('/analytics/costs')])
      .then(([overviewRes, costsRes]) => {
        setOverview(overviewRes.data.data)
        setCosts(costsRes.data.data)
      })
      .catch(() => {
        setOverview({ cards: [], routeUtilization: [], exceptions: [] })
        setCosts({ departments: [], groups: [] })
      })
  }, [])

  return (
    <div className="space-y-6">
      <SectionHeader title="Analytics" subtitle="Operational trends, exceptions, and cost visibility." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(overview?.cards || []).map((card: any, index: number) => (
          <StatCard key={index} label={card?.title || card?.label || `Card ${index + 1}`} value={card?.value ?? 0} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <SectionHeader title="Route utilization" subtitle="Employees and groups by route." />
          <DataTable<any>
            rows={overview?.routeUtilization || []}
            columns={[
              { key: 'route_name', title: 'Route', render: (row) => row?.route_name || '-' },
              { key: 'groups', title: 'Groups', render: (row) => row?.groups ?? 0 },
              { key: 'employees', title: 'Employees', render: (row) => row?.employees ?? 0 },
            ]}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <SectionHeader title="Exceptions" subtitle="Overflow and operational exception counts." />
          <DataTable<any>
            rows={overview?.exceptions || []}
            columns={[
              { key: 'exception_type', title: 'Exception', render: (row) => row?.exception_type || '-' },
              { key: 'count', title: 'Count', render: (row) => row?.count ?? 0 },
            ]}
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <SectionHeader title="Department cost summary" subtitle="Estimated cost by department." />
          <DataTable<any>
            rows={costs?.departments || []}
            columns={[
              { key: 'department_name', title: 'Department', render: (row) => row?.department_name || '-' },
              { key: 'total_cost', title: 'Estimated cost', render: (row) => row?.total_cost ?? 0 },
            ]}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <SectionHeader title="Group cost summary" subtitle="Estimated distance and cost by generated group." />
          <DataTable<any>
            rows={costs?.groups || []}
            columns={[
              { key: 'group_code', title: 'Group', render: (row) => row?.group_code || '-' },
              { key: 'registration_no', title: 'Vehicle', render: (row) => row?.registration_no || '-' },
              { key: 'estimated_distance_km', title: 'Distance km', render: (row) => row?.estimated_distance_km ?? 0 },
              { key: 'estimated_cost', title: 'Cost', render: (row) => row?.estimated_cost ?? 0 },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

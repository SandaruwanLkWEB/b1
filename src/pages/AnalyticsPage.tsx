import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import SectionHeader from '../components/SectionHeader';
import StatCard from '../components/StatCard';
import api from '../lib/api';

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<any>(null);
  const [costs, setCosts] = useState<any>(null);

  useEffect(() => {
    Promise.all([api.get('/analytics/overview'), api.get('/analytics/costs')]).then(([a, c]) => {
      setOverview(a.data.data);
      setCosts(c.data.data);
    });
  }, []);

  return (
    <div className="space-y-6">
      <SectionHeader title="Advanced analytics" subtitle="Utilization, demand, exceptions, and cost intelligence for overtime transport planning" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(overview?.cards || []).map((card: any) => <StatCard key={card.label} label={card.label} value={card.value} />)}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DataTable rows={overview?.routeDemand || []} columns={[
          { key: 'route_name', title: 'Route / Corridor', render: (row) => row.route_name },
          { key: 'groups', title: 'Groups', render: (row) => row.groups },
          { key: 'employees', title: 'Employees', render: (row) => row.employees },
        ]} />
        <DataTable rows={overview?.exceptions || []} columns={[
          { key: 'exception_type', title: 'Exception', render: (row) => row.exception_type },
          { key: 'count', title: 'Count', render: (row) => row.count },
        ]} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DataTable rows={costs?.departments || []} columns={[
          { key: 'department_name', title: 'Department', render: (row) => row.department_name },
          { key: 'total_cost', title: 'Estimated Cost', render: (row) => row.total_cost },
        ]} />
        <DataTable rows={costs?.groups || []} columns={[
          { key: 'group_code', title: 'Group', render: (row) => row.group_code },
          { key: 'registration_no', title: 'Vehicle', render: (row) => row.registration_no || '-' },
          { key: 'estimated_distance_km', title: 'Distance km', render: (row) => row.estimated_distance_km },
          { key: 'estimated_cost', title: 'Cost', render: (row) => row.estimated_cost },
        ]} />
      </div>
    </div>
  );
}

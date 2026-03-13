import { useEffect, useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import api from '../lib/api';
import { DashboardCard } from '../types';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get('/dashboard/summary').then((response) => setData(response.data.data));
  }, []);

  return (
    <div className="space-y-6">
      <SectionHeader title="Dashboard" subtitle="Role-aware transport operations overview for overtime dispatch and approvals" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(data?.cards || []).map((card: DashboardCard) => (
          <StatCard key={card.label} label={card.label} value={card.value} />
        ))}
      </div>

      {data?.recentRequests?.length ? (
        <div className="card p-5">
          <h3 className="text-lg font-semibold">Recent requests</h3>
          <div className="mt-4 space-y-3">
            {data.recentRequests.map((row: any) => (
              <div key={row.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <div>
                  <p className="font-medium">{row.request_code}</p>
                  <p className="text-sm text-slate-500">{row.request_date} · {row.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {data?.vehicles?.length ? (
        <div className="card p-5">
          <h3 className="text-lg font-semibold">Fleet capacity overview</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {data.vehicles.map((item: any) => (
              <div key={item.registration_no} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <p className="font-medium">{item.registration_no}</p>
                <p className="text-sm text-slate-500">Capacity {item.capacity}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {data?.currentTransport ? (
        <div className="card p-5">
          <h3 className="text-lg font-semibold">Today’s transport</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div><p className="text-sm text-slate-500">Route</p><p className="font-semibold">{data.currentTransport.route_name}</p></div>
            <div><p className="text-sm text-slate-500">Vehicle</p><p className="font-semibold">{data.currentTransport.registration_no}</p></div>
            <div><p className="text-sm text-slate-500">Driver</p><p className="font-semibold">{data.currentTransport.driver_name}</p></div>
            <div><p className="text-sm text-slate-500">Phone</p><p className="font-semibold">{data.currentTransport.driver_phone}</p></div>
          </div>
        </div>
      ) : null}

      {!data ? <EmptyState title="Loading dashboard" message="Please wait while the role summary loads." /> : null}
    </div>
  );
}

import { FormEvent, useEffect, useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import DataTable from '../components/DataTable';
import api from '../lib/api';

export default function SelfServicePage() {
  const [overview, setOverview] = useState<any>({ transport: [], issues: [], locationChanges: [] });
  const [issue, setIssue] = useState({ title: '', message: '' });
  const [location, setLocation] = useState({ requestedPlaceId: '', requestedLat: '', requestedLng: '', reason: '' });

  const load = async () => setOverview((await api.get('/self-service/overview')).data.data);
  useEffect(() => { load(); }, []);

  const submitIssue = async (event: FormEvent) => {
    event.preventDefault();
    await api.post('/self-service/issues', issue);
    setIssue({ title: '', message: '' });
    load();
  };

  const submitLocation = async (event: FormEvent) => {
    event.preventDefault();
    await api.post('/self-service/location-change', { ...location, requestedPlaceId: location.requestedPlaceId ? Number(location.requestedPlaceId) : undefined });
    setLocation({ requestedPlaceId: '', requestedLat: '', requestedLng: '', reason: '' });
    load();
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Employee self-service" subtitle="Today’s transport, issue reporting, and pickup location correction requests" />
      <div className="grid gap-6 xl:grid-cols-2">
        <form className="card p-5" onSubmit={submitIssue}>
          <h3 className="text-lg font-semibold">Report transport issue</h3>
          <div className="mt-4 space-y-4">
            <input className="input" placeholder="Issue title" value={issue.title} onChange={(e) => setIssue({ ...issue, title: e.target.value })} />
            <textarea className="input min-h-24" placeholder="Message" value={issue.message} onChange={(e) => setIssue({ ...issue, message: e.target.value })} />
            <button className="btn-primary">Submit issue</button>
          </div>
        </form>
        <form className="card p-5" onSubmit={submitLocation}>
          <h3 className="text-lg font-semibold">Request location change</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input className="input" placeholder="Place ID (optional)" value={location.requestedPlaceId} onChange={(e) => setLocation({ ...location, requestedPlaceId: e.target.value })} />
            <input className="input" placeholder="Latitude" value={location.requestedLat} onChange={(e) => setLocation({ ...location, requestedLat: e.target.value })} />
            <input className="input" placeholder="Longitude" value={location.requestedLng} onChange={(e) => setLocation({ ...location, requestedLng: e.target.value })} />
            <textarea className="input md:col-span-2 min-h-24" placeholder="Reason" value={location.reason} onChange={(e) => setLocation({ ...location, reason: e.target.value })} />
            <button className="btn-primary md:col-span-2">Send location request</button>
          </div>
        </form>
      </div>
      <DataTable rows={overview.transport || []} columns={[
        { key: 'request_date', title: 'Date', render: (row) => row.request_date },
        { key: 'route_name', title: 'Route', render: (row) => row.route_name || '-' },
        { key: 'registration_no', title: 'Vehicle', render: (row) => row.registration_no || '-' },
        { key: 'driver_name', title: 'Driver', render: (row) => row.driver_name || '-' },
        { key: 'driver_phone', title: 'Driver phone', render: (row) => row.driver_phone || '-' },
      ]} />
    </div>
  );
}

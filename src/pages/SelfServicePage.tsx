import { FormEvent, useEffect, useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import DataTable from '../components/DataTable';
import api from '../lib/api';

type TransportRow = {
  id?: number | string;
  request_date: string;
  route_name?: string | null;
  registration_no?: string | null;
  driver_name?: string | null;
  driver_phone?: string | null;
};

type IssueRow = {
  id?: number | string;
  title: string;
  message: string;
  status?: string | null;
  created_at?: string | null;
};

type LocationChangeRow = {
  id?: number | string;
  requested_place_id?: number | null;
  requested_lat?: number | string | null;
  requested_lng?: number | string | null;
  reason?: string | null;
  status?: string | null;
  created_at?: string | null;
};

type SelfServiceOverview = {
  transport: TransportRow[];
  issues: IssueRow[];
  locationChanges: LocationChangeRow[];
};

export default function SelfServicePage() {
  const [overview, setOverview] = useState<SelfServiceOverview>({
    transport: [],
    issues: [],
    locationChanges: [],
  });

  const [issue, setIssue] = useState({
    title: '',
    message: '',
  });

  const [location, setLocation] = useState({
    requestedPlaceId: '',
    requestedLat: '',
    requestedLng: '',
    reason: '',
  });

  const load = async () => {
    const response = await api.get('/self-service/overview');
    setOverview(
      response.data?.data ?? {
        transport: [],
        issues: [],
        locationChanges: [],
      },
    );
  };

  useEffect(() => {
    load();
  }, []);

  const submitIssue = async (event: FormEvent) => {
    event.preventDefault();
    await api.post('/self-service/issues', issue);
    setIssue({ title: '', message: '' });
    await load();
  };

  const submitLocation = async (event: FormEvent) => {
    event.preventDefault();

    await api.post('/self-service/location-change', {
      ...location,
      requestedPlaceId: location.requestedPlaceId
        ? Number(location.requestedPlaceId)
        : undefined,
      requestedLat: location.requestedLat
        ? Number(location.requestedLat)
        : undefined,
      requestedLng: location.requestedLng
        ? Number(location.requestedLng)
        : undefined,
    });

    setLocation({
      requestedPlaceId: '',
      requestedLat: '',
      requestedLng: '',
      reason: '',
    });

    await load();
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Self Service"
        subtitle="View your transport details and submit requests."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <form className="card p-5" onSubmit={submitIssue}>
          <h3 className="text-lg font-semibold">Report transport issue</h3>

          <div className="mt-4 grid gap-4">
            <input
              className="input"
              placeholder="Issue title"
              value={issue.title}
              onChange={(e) =>
                setIssue({ ...issue, title: e.target.value })
              }
            />

            <textarea
              className="input min-h-28"
              placeholder="Describe the issue"
              value={issue.message}
              onChange={(e) =>
                setIssue({ ...issue, message: e.target.value })
              }
            />

            <button className="btn-primary" type="submit">
              Submit issue
            </button>
          </div>
        </form>

        <form className="card p-5" onSubmit={submitLocation}>
          <h3 className="text-lg font-semibold">Request location change</h3>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input
              className="input"
              placeholder="Place ID (optional)"
              value={location.requestedPlaceId}
              onChange={(e) =>
                setLocation({
                  ...location,
                  requestedPlaceId: e.target.value,
                })
              }
            />

            <input
              className="input"
              placeholder="Latitude"
              value={location.requestedLat}
              onChange={(e) =>
                setLocation({
                  ...location,
                  requestedLat: e.target.value,
                })
              }
            />

            <input
              className="input"
              placeholder="Longitude"
              value={location.requestedLng}
              onChange={(e) =>
                setLocation({
                  ...location,
                  requestedLng: e.target.value,
                })
              }
            />

            <textarea
              className="input md:col-span-2 min-h-24"
              placeholder="Reason"
              value={location.reason}
              onChange={(e) =>
                setLocation({
                  ...location,
                  reason: e.target.value,
                })
              }
            />

            <button className="btn-primary md:col-span-2" type="submit">
              Send location request
            </button>
          </div>
        </form>
      </div>

      <div className="card p-5">
        <h3 className="text-lg font-semibold mb-4">Today transport details</h3>
        <DataTable
          rows={overview.transport}
          columns={[
            {
              key: 'request_date',
              title: 'Date',
              render: (row: TransportRow) => row.request_date || '-',
            },
            {
              key: 'route_name',
              title: 'Route',
              render: (row: TransportRow) => row.route_name || '-',
            },
            {
              key: 'registration_no',
              title: 'Vehicle',
              render: (row: TransportRow) => row.registration_no || '-',
            },
            {
              key: 'driver_name',
              title: 'Driver',
              render: (row: TransportRow) => row.driver_name || '-',
            },
            {
              key: 'driver_phone',
              title: 'Driver phone',
              render: (row: TransportRow) => row.driver_phone || '-',
            },
          ]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="text-lg font-semibold mb-4">My issues</h3>
          <DataTable
            rows={overview.issues}
            columns={[
              {
                key: 'title',
                title: 'Title',
                render: (row: IssueRow) => row.title,
              },
              {
                key: 'message',
                title: 'Message',
                render: (row: IssueRow) => row.message,
              },
              {
                key: 'status',
                title: 'Status',
                render: (row: IssueRow) => row.status || '-',
              },
              {
                key: 'created_at',
                title: 'Created',
                render: (row: IssueRow) => row.created_at || '-',
              },
            ]}
          />
        </div>

        <div className="card p-5">
          <h3 className="text-lg font-semibold mb-4">Location change requests</h3>
          <DataTable
            rows={overview.locationChanges}
            columns={[
              {
                key: 'requested_place_id',
                title: 'Place ID',
                render: (row: LocationChangeRow) =>
                  row.requested_place_id?.toString() || '-',
              },
              {
                key: 'requested_lat',
                title: 'Latitude',
                render: (row: LocationChangeRow) =>
                  row.requested_lat?.toString() || '-',
              },
              {
                key: 'requested_lng',
                title: 'Longitude',
                render: (row: LocationChangeRow) =>
                  row.requested_lng?.toString() || '-',
              },
              {
                key: 'status',
                title: 'Status',
                render: (row: LocationChangeRow) => row.status || '-',
              },
              {
                key: 'created_at',
                title: 'Created',
                render: (row: LocationChangeRow) => row.created_at || '-',
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

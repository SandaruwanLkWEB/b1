import { FormEvent, useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import SectionHeader from '../components/SectionHeader';
import api from '../lib/api';

export default function GroupingTemplatesPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [form, setForm] = useState({ routeId: '', name: '', templateType: 'CORRIDOR_HINT', config: '{"mergeRadiusKm": 4, "preferSingleVehicleUntil": 15}' });

  const load = async () => {
    const [templates, routesRes] = await Promise.all([api.get('/grouping-templates'), api.get('/routes')]);
    setRows(templates.data.data);
    setRoutes(routesRes.data.data);
  };
  useEffect(() => { load(); }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await api.post('/grouping-templates', { routeId: form.routeId ? Number(form.routeId) : undefined, name: form.name, templateType: form.templateType, config: JSON.parse(form.config) });
    setForm({ routeId: '', name: '', templateType: 'CORRIDOR_HINT', config: '{"mergeRadiusKm": 4, "preferSingleVehicleUntil": 15}' });
    load();
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Saved grouping templates" subtitle="Reusable corridor hints, merge preferences, and template guidance for automatic grouping runs" />
      <form className="card grid gap-4 p-5 md:grid-cols-2" onSubmit={submit}>
        <select className="input" value={form.routeId} onChange={(e) => setForm({ ...form, routeId: e.target.value })}><option value="">All routes</option>{routes.map((route) => <option key={route.id} value={route.id}>{route.name}</option>)}</select>
        <input className="input" placeholder="Template name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Template type" value={form.templateType} onChange={(e) => setForm({ ...form, templateType: e.target.value })} />
        <button className="btn-primary">Save template</button>
        <textarea className="input min-h-28 md:col-span-2" value={form.config} onChange={(e) => setForm({ ...form, config: e.target.value })} />
      </form>
      <DataTable rows={rows} columns={[
        { key: 'name', title: 'Template', render: (row) => row.name },
        { key: 'template_type', title: 'Type', render: (row) => row.template_type },
        { key: 'route_name', title: 'Route', render: (row) => row.route_name || 'All routes' },
        { key: 'active', title: 'Active', render: (row) => row.active ? 'Yes' : 'No' },
      ]} />
    </div>
  );
}

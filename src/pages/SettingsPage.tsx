import { FormEvent, useEffect, useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import api from '../lib/api';

export default function SettingsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState({
    grouping: '{\n  "radiusKm": 3,\n  "maxFallbackCapacity": 30,\n  "allowRegeneration": true\n}',
    theme: '{\n  "default": "light",\n  "darkModeEnabled": true\n}',
  });
  const [message, setMessage] = useState('');

  const load = async () => {
    const { data } = await api.get('/settings');
    const items = data.data || [];
    setRows(items);
    const grouping = items.find((item: any) => item.key === 'grouping.defaults');
    const theme = items.find((item: any) => item.key === 'ui.theme');
    if (grouping) setForm((prev) => ({ ...prev, grouping: JSON.stringify(grouping.value, null, 2) }));
    if (theme) setForm((prev) => ({ ...prev, theme: JSON.stringify(theme.value, null, 2) }));
  };

  useEffect(() => { load(); }, []);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    await Promise.all([
      api.patch('/settings', { key: 'grouping.defaults', value: JSON.parse(form.grouping) }),
      api.patch('/settings', { key: 'ui.theme', value: JSON.parse(form.theme) }),
    ]);
    setMessage('Settings updated successfully');
    load();
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Settings" subtitle="Operational defaults and UI settings stored in the database" />
      {message ? <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <form className="card p-6" onSubmit={save}>
          <h3 className="text-lg font-semibold">System settings</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="label">Grouping defaults JSON</label>
              <textarea className="input min-h-44 font-mono text-xs" value={form.grouping} onChange={(e) => setForm({ ...form, grouping: e.target.value })} />
            </div>
            <div>
              <label className="label">UI theme JSON</label>
              <textarea className="input min-h-36 font-mono text-xs" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} />
            </div>
            <button className="btn-primary">Save settings</button>
          </div>
        </form>

        <div className="card p-6">
          <h3 className="text-lg font-semibold">Stored keys</h3>
          <div className="mt-4 space-y-3">
            {rows.map((row) => (
              <div key={row.id} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                <p className="font-medium">{row.key}</p>
                <pre className="mt-2 overflow-auto rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-900">{JSON.stringify(row.value, null, 2)}</pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

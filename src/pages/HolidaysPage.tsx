import { FormEvent, useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import SectionHeader from '../components/SectionHeader';
import api from '../lib/api';

export default function HolidaysPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState({ holidayDate: '', title: '', dayType: 'HOLIDAY', note: '' });

  const load = async () => setRows((await api.get('/holidays')).data.data);
  useEffect(() => { load(); }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await api.post('/holidays', form);
    setForm({ holidayDate: '', title: '', dayType: 'HOLIDAY', note: '' });
    load();
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Holiday & special day planning" subtitle="Define special operating days and reduced or changed overtime transport behaviour" />
      <form className="card grid gap-4 p-5 md:grid-cols-4" onSubmit={submit}>
        <input type="date" className="input" value={form.holidayDate} onChange={(e) => setForm({ ...form, holidayDate: e.target.value })} />
        <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="input" placeholder="Day type" value={form.dayType} onChange={(e) => setForm({ ...form, dayType: e.target.value })} />
        <button className="btn-primary">Save day rule</button>
        <textarea className="input md:col-span-4 min-h-24" placeholder="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
      </form>
      <DataTable rows={rows} columns={[
        { key: 'holiday_date', title: 'Date', render: (row) => row.holiday_date },
        { key: 'title', title: 'Title', render: (row) => row.title },
        { key: 'day_type', title: 'Type', render: (row) => row.day_type },
        { key: 'note', title: 'Note', render: (row) => row.note || '-' },
      ]} />
    </div>
  );
}

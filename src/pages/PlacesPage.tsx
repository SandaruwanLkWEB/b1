import { FormEvent, useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import SectionHeader from '../components/SectionHeader';
import api from '../lib/api';

export default function PlacesPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ externalPlaceId: '', title: '', address: '', lat: '', lng: '' });

  const load = async () => setRows((await api.get('/places', { params: { search } })).data.data);
  useEffect(() => { load(); }, [search]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = { ...form, lat: Number(form.lat), lng: Number(form.lng) };
    if (editing) await api.patch(`/places/${editing.id}`, payload); else await api.post('/places', payload);
    setOpen(false); setEditing(null); setForm({ externalPlaceId: '', title: '', address: '', lat: '', lng: '' });
    load();
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Places" subtitle="Searchable place master with latitude and longitude" action={<button className="btn-primary" onClick={() => setOpen(true)}>New place</button>} />
      <input className="input max-w-sm" placeholder="Search places..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <DataTable rows={rows} columns={[
        { key: 'title', title: 'Title', render: (row) => row.title },
        { key: 'address', title: 'Address', render: (row) => row.address },
        { key: 'coords', title: 'Coordinates', render: (row) => `${row.lat}, ${row.lng}` },
        { key: 'actions', title: 'Actions', render: (row) => <button className="btn-secondary" onClick={() => { setEditing(row); setForm({ externalPlaceId: row.external_place_id || '', title: row.title, address: row.address, lat: row.lat, lng: row.lng }); setOpen(true); }}>Edit</button> },
      ]} />
      <Modal open={open} title={editing ? 'Edit place' : 'Create place'} onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={submit}>
          <div><label className="label">External place ID</label><input className="input" value={form.externalPlaceId} onChange={(e) => setForm({ ...form, externalPlaceId: e.target.value })} /></div>
          <div><label className="label">Title</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="label">Address</label><input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="label">Latitude</label><input className="input" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} /></div>
            <div><label className="label">Longitude</label><input className="input" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} /></div>
          </div>
          <button className="btn-primary">Save</button>
        </form>
      </Modal>
    </div>
  );
}

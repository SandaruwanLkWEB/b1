import { FormEvent, useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import SectionHeader from '../components/SectionHeader';
import StatusBadge from '../components/StatusBadge';
import api from '../lib/api';

export default function UsersPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [current, setCurrent] = useState<any | null>(null);
  const [profile, setProfile] = useState({ fullName: '', email: '', phone: '' });
  const [newPassword, setNewPassword] = useState('password123');
  const [message, setMessage] = useState('');

  const load = async () => {
    const { data } = await api.get('/users', { params: { search } });
    setRows(data.data);
  };

  useEffect(() => { load(); }, [search]);

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    await api.patch(`/users/${current.id}`, profile);
    setEditOpen(false);
    setMessage('User profile updated');
    load();
  };

  const savePassword = async (event: FormEvent) => {
    event.preventDefault();
    await api.patch(`/users/${current.id}/reset-password`, { newPassword });
    setPasswordOpen(false);
    setMessage('Password reset completed');
  };

  const toggleSuspend = async (row: any) => {
    await api.patch(`/users/${row.id}/suspend`, { suspended: row.status !== 'SUSPENDED' });
    setMessage(row.status === 'SUSPENDED' ? 'User unsuspended' : 'User suspended');
    load();
  };

  const toggleF2A = async (row: any) => {
    await api.patch(`/users/${row.id}/f2a?enabled=${!row.f2a_enabled}`);
    setMessage(!row.f2a_enabled ? 'F2A enabled' : 'F2A disabled');
    load();
  };

  const removeUser = async (row: any) => {
    await api.delete(`/users/${row.id}`);
    setMessage('User removed from active access');
    load();
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Users" subtitle="Account management for roles, suspension, password reset, and F2A flags" />
      {message ? <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}
      <input className="input max-w-sm" placeholder="Search by user name, email or employee no" value={search} onChange={(e) => setSearch(e.target.value)} />
      <DataTable rows={rows} columns={[
        { key: 'full_name', title: 'Name', render: (row) => row.full_name },
        { key: 'email', title: 'Email', render: (row) => row.email },
        { key: 'role', title: 'Role', render: (row) => row.role },
        { key: 'emp_no', title: 'Emp No', render: (row) => row.emp_no || '-' },
        { key: 'status', title: 'Status', render: (row) => <StatusBadge status={row.status} /> },
        { key: 'actions', title: 'Actions', render: (row) => (
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => { setCurrent(row); setProfile({ fullName: row.full_name, email: row.email, phone: row.phone || '' }); setEditOpen(true); }}>Edit</button>
            <button className="btn-secondary" onClick={() => { setCurrent(row); setPasswordOpen(true); }}>Reset password</button>
            <button className="btn-secondary" onClick={() => toggleSuspend(row)}>{row.status === 'SUSPENDED' ? 'Unsuspend' : 'Suspend'}</button>
            <button className="btn-secondary" onClick={() => toggleF2A(row)}>{row.f2a_enabled ? 'Disable F2A' : 'Enable F2A'}</button>
            <button className="btn-secondary" onClick={() => removeUser(row)}>Remove</button>
          </div>
        ) },
      ]} />
      <Modal open={editOpen} title="Edit user" onClose={() => setEditOpen(false)}>
        <form className="space-y-4" onSubmit={saveProfile}>
          <div><label className="label">Full name</label><input className="input" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} /></div>
          <div><label className="label">Email</label><input className="input" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></div>
          <div><label className="label">Phone</label><input className="input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
          <button className="btn-primary">Save</button>
        </form>
      </Modal>
      <Modal open={passwordOpen} title="Reset password" onClose={() => setPasswordOpen(false)}>
        <form className="space-y-4" onSubmit={savePassword}>
          <div><label className="label">New password</label><input className="input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
          <button className="btn-primary">Update password</button>
        </form>
      </Modal>
    </div>
  );
}

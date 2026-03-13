import { FormEvent, useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState({ fullName: user?.fullName || '', email: user?.email || '', phone: user?.phone || '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    if (!user?.id) return;
    await api.patch(`/users/${user.id}`, profile);
    await refreshProfile();
    setMessage('Profile updated');
  };

  const savePassword = async (event: FormEvent) => {
    event.preventDefault();
    await api.post('/auth/change-password', password);
    setPassword({ currentPassword: '', newPassword: '' });
    setMessage('Password changed');
  };

  const toggleF2A = async () => {
    if (!user?.id) return;
    await api.patch(`/users/${user.id}/f2a?enabled=${!user.f2a_enabled}`);
    await refreshProfile();
    setMessage('Two-factor setting updated');
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Profile" subtitle="Manage your own name, email, password and two-factor toggle. Employee number stays locked." />
      {message ? <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}
      <div className="grid gap-6 xl:grid-cols-2">
        <form className="card p-6" onSubmit={saveProfile}>
          <h3 className="text-lg font-semibold">Profile details</h3>
          <div className="mt-4 space-y-4">
            <div><label className="label">Full name</label><input className="input" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} /></div>
            <div><label className="label">Email</label><input className="input" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></div>
            <div><label className="label">Phone</label><input className="input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
            <div><label className="label">Employee No</label><input className="input" disabled value={user?.emp_no || 'Not linked'} /></div>
            <button className="btn-primary">Save profile</button>
          </div>
        </form>

        <div className="space-y-6">
          <form className="card p-6" onSubmit={savePassword}>
            <h3 className="text-lg font-semibold">Change password</h3>
            <div className="mt-4 space-y-4">
              <div><label className="label">Current password</label><input type="password" className="input" value={password.currentPassword} onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })} /></div>
              <div><label className="label">New password</label><input type="password" className="input" value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} /></div>
              <button className="btn-primary">Update password</button>
            </div>
          </form>
          <div className="card p-6">
            <h3 className="text-lg font-semibold">Security</h3>
            <p className="mt-2 text-sm text-slate-500">Toggle the F2A flag for your own account. Admin, HOD and HR can also toggle it for managed accounts.</p>
            <button className="btn-secondary mt-4" onClick={toggleF2A}>{user?.f2a_enabled ? 'Disable' : 'Enable'} F2A</button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, UserPlus2 } from 'lucide-react';
import api from '../lib/api';

export default function SelfRegisterPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    departmentId: '',
    empNo: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await api.post('/employees/self-register', {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        departmentId: form.departmentId ? Number(form.departmentId) : undefined,
        empNo: form.empNo || undefined,
      });
      setMessage('Registration request submitted. Your HOD can review and approve the account.');
      setForm({ fullName: '', email: '', phone: '', password: '', departmentId: '', empNo: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to submit the registration request');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 dark:bg-slate-950">
      <form onSubmit={submit} className="card w-full max-w-2xl p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Self registration</p>
            <h1 className="mt-3 text-3xl font-semibold">Create your employee access request</h1>
            <p className="mt-2 text-sm text-slate-500">Enter your work details. Approval goes to your department HOD.</p>
          </div>
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-700 dark:bg-slate-800 dark:text-blue-300">
            <UserPlus2 className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Full name</label>
            <input className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div>
            <label className="label">Work email</label>
            <input className="input" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Phone number</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Used for SMS / WhatsApp" />
          </div>
          <div>
            <label className="label">Department ID</label>
            <input className="input" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })} placeholder="Example: 1" />
          </div>
          <div>
            <label className="label">Employee number</label>
            <input className="input" value={form.empNo} onChange={(e) => setForm({ ...form, empNo: e.target.value })} placeholder="Optional if not yet assigned" />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
        </div>

        {message ? <div className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</div> : null}
        {error ? <div className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button className="btn-primary" disabled={busy}>{busy ? 'Submitting...' : 'Submit registration'}</button>
          <Link className="btn-secondary gap-2" to="/login">
            <ArrowLeft className="h-4 w-4" /> Back to login
          </Link>
        </div>
      </form>
    </div>
  );
}

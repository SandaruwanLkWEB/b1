import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@company.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to sign in');
    } finally {
      setBusy(false);
    }
  };

  if (busy) return <LoadingScreen message="Signing you in..." />;

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <div className="hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-blue-300">2026 enterprise transport suite</p>
          <h1 className="mt-6 max-w-xl text-5xl font-semibold leading-tight">Operationally correct transport workflow for real office teams.</h1>
          <p className="mt-6 max-w-xl text-base text-blue-100/80">
            Multi-step approvals, snapshot-safe grouping, role dashboards, vehicle assignment, and report-ready outputs.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {['Audit-friendly statuses', 'Generated route snapshots', 'Practical daily operations'].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-blue-50/80">{item}</div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-12">
        <form onSubmit={submit} className="card w-full max-w-md p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Transport Ops</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">Use any seeded demo account. Default password: <strong>password123</strong></p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="label">Email</label>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          {error ? <div className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}

          <button className="btn-primary mt-6 w-full">Sign in</button>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs text-slate-500 dark:bg-slate-900">
            <p>Demo users: admin@company.com, hr@company.com, ta@company.com, hod@company.com, emp@company.com, planning@company.com, superadmin@company.com</p>
          </div>
        </form>
      </div>
    </div>
  );
}

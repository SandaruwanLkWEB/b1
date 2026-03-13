import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, KeyRound } from 'lucide-react';
import api from '../lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await api.post('/auth/request-password-reset', { email });
      setMessage('Password reset request recorded. Check your email or contact the help desk if your tenant uses manual reset.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to submit the password reset request');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 dark:bg-slate-950">
      <form onSubmit={submit} className="card w-full max-w-xl p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Password recovery</p>
            <h1 className="mt-3 text-3xl font-semibold">Reset your sign-in access</h1>
            <p className="mt-2 text-sm text-slate-500">Enter your work email. The system can route this to automated reset or help desk review.</p>
          </div>
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-700 dark:bg-slate-800 dark:text-blue-300">
            <KeyRound className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-8">
          <label className="label">Work email</label>
          <input className="input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        {message ? <div className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</div> : null}
        {error ? <div className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button className="btn-primary" disabled={busy}>{busy ? 'Submitting...' : 'Request password reset'}</button>
          <Link className="btn-secondary gap-2" to="/login">
            <ArrowLeft className="h-4 w-4" /> Back to login
          </Link>
          <Link className="btn-secondary" to="/help-desk">Open help desk</Link>
        </div>
      </form>
    </div>
  );
}

import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HelpCircle, Moon, ShieldCheck, Sun, UserPlus } from 'lucide-react';
import { useAuth, SAVED_EMAIL_KEY } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LoadingScreen from '../components/LoadingScreen';

const DEMO_USERS = [
  'admin@company.com',
  'hr@company.com',
  'ta@company.com',
  'hod@company.com',
  'emp@company.com',
  'planning@company.com',
  'superadmin@company.com',
];

export default function LoginPage() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const savedEmail = useMemo(() => localStorage.getItem(SAVED_EMAIL_KEY) || 'admin@company.com', []);
  const [email, setEmail] = useState(savedEmail);
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(Boolean(localStorage.getItem(SAVED_EMAIL_KEY)));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password, rememberMe);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to sign in');
    } finally {
      setBusy(false);
    }
  };

  if (busy) return <LoadingScreen message="Signing you in to the enterprise workspace..." />;

  return (
    <div className="grid min-h-screen bg-slate-100 dark:bg-slate-950 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-blue-300">2026 enterprise transport suite</p>
              <h1 className="mt-6 max-w-xl text-5xl font-semibold leading-tight">
                Overtime transport control with enterprise-grade workflow.
              </h1>
            </div>
            <button
              className="rounded-2xl border border-white/10 bg-white/10 p-3 transition hover:bg-white/20"
              onClick={toggleTheme}
              type="button"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>
          <p className="mt-6 max-w-xl text-base text-blue-100/80">
            Self registration, secure sign-in, snapshot-safe transport assignments, audit-ready approvals, and practical daily dispatch.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {['Self service onboarding', 'Dark mode ready', 'Help desk support'].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-blue-50/80">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg space-y-5">
          <div className="flex items-center justify-end lg:hidden">
            <button className="btn-secondary p-2" onClick={toggleTheme} type="button">
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </div>

          <form onSubmit={submit} className="card w-full p-8 shadow-2xl shadow-slate-200/60 dark:shadow-black/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Transport Ops</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight">Welcome back</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Sign in to manage transport operations. Passwords can be saved securely by your browser.
                </p>
              </div>
              <div className="hidden rounded-2xl bg-blue-50 p-3 text-blue-700 dark:bg-slate-800 dark:text-blue-300 sm:block">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div>
                <label className="label">Email</label>
                <input
                  className="input"
                  value={email}
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="label">Password</label>
                <input
                  className="input"
                  type="password"
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Keep me signed in on this device
                </label>
                <Link className="font-medium text-blue-600 hover:text-blue-700" to="/forgot-password">
                  Reset password
                </Link>
              </div>
            </div>

            {error ? <div className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}

            <button className="btn-primary mt-6 w-full">Sign in</button>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Link to="/self-register" className="btn-secondary gap-2">
                <UserPlus className="h-4 w-4" /> Self register
              </Link>
              <Link to="/help-desk" className="btn-secondary gap-2">
                <HelpCircle className="h-4 w-4" /> Help desk
              </Link>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setEmail('emp@company.com');
                  setPassword('password123');
                }}
              >
                Try employee demo
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs text-slate-500 dark:bg-slate-900">
              <p className="font-medium text-slate-700 dark:text-slate-200">Demo accounts</p>
              <p className="mt-1">{DEMO_USERS.join(', ')}</p>
              <p className="mt-2">Default demo password: <strong>password123</strong></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

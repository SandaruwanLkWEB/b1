import { FormEvent, useMemo, useState } from 'react';
import { Headset, LifeBuoy, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SUPPORT_EMAIL = 'support@company.com';
const SUPPORT_PHONE = '+94 77 000 0000';

export default function HelpDeskPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const mailto = useMemo(() => {
    const subject = encodeURIComponent('Transport Ops Help Desk Request');
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nIssue:\n${form.message}`,
    );
    return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  }, [form]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    window.location.href = mailto;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 dark:bg-slate-950">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card p-8">
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-700 dark:bg-slate-800 dark:text-blue-300 w-fit">
            <LifeBuoy className="h-5 w-5" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Help desk</p>
          <h1 className="mt-3 text-3xl font-semibold">Need assistance with sign-in or registration?</h1>
          <p className="mt-3 text-sm text-slate-500">
            Use the support contact points below for login issues, account approvals, password reset follow-up, or transport self-service problems.
          </p>

          <div className="mt-6 space-y-4 text-sm">
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="font-medium">Support email</p>
              <a className="mt-1 block text-blue-600" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="font-medium">Support phone / WhatsApp</p>
              <a className="mt-1 block text-blue-600" href={`tel:${SUPPORT_PHONE.replace(/\s+/g, '')}`}>{SUPPORT_PHONE}</a>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="font-medium">Support hours</p>
              <p className="mt-1 text-slate-500">Monday to Saturday, 7:00 AM to 10:00 PM</p>
            </div>
          </div>

          <Link className="btn-secondary mt-6 gap-2" to="/login">
            <ArrowLeft className="h-4 w-4" /> Back to login
          </Link>
        </div>

        <form onSubmit={submit} className="card p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Send support request</p>
              <h2 className="mt-3 text-2xl font-semibold">Open a help desk email</h2>
            </div>
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-700 dark:bg-slate-800 dark:text-blue-300">
              <Headset className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="label">Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Include WhatsApp if available" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Issue</label>
              <textarea className="input min-h-36" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Describe the problem" />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn-primary">Open support email</button>
            <Link className="btn-secondary" to="/forgot-password">Password reset page</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

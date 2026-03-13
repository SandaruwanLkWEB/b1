import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="card mx-auto max-w-xl p-10 text-center">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 text-sm text-slate-500">The page you requested does not exist in this workspace.</p>
      <Link to="/" className="btn-primary mt-6">Go back home</Link>
    </div>
  );
}

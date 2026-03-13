export default function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="card p-10 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{message}</p>
    </div>
  );
}

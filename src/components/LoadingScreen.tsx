export default function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="card w-full max-w-sm p-8 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
        <h2 className="text-lg font-semibold">Please wait</h2>
        <p className="mt-2 text-sm text-slate-500">{message}</p>
      </div>
    </div>
  );
}

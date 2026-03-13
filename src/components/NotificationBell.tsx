import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  const load = async () => {
    const { data } = await api.get('/notifications');
    setItems(data.data);
  };

  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  const unread = items.filter((item) => !item.read_at).length;

  const markRead = async (id: number) => {
    await api.post(`/notifications/${id}/read`);
    await load();
  };

  return (
    <div className="relative">
      <button className="btn-secondary p-2" onClick={() => setOpen((v) => !v)}>
        <Bell className="h-4 w-4" />
        {unread ? <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">{unread}</span> : null}
      </button>
      {open ? (
        <div className="card absolute right-0 z-50 mt-2 w-80 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="font-semibold">Notifications</h4>
            <button className="text-xs text-slate-500" onClick={() => setOpen(false)}>Close</button>
          </div>
          <div className="space-y-2">
            {items.length ? items.map((item) => (
              <button key={item.id} className="w-full rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800" onClick={() => markRead(item.id)}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{item.title}</p>
                  {!item.read_at ? <span className="h-2 w-2 rounded-full bg-blue-600" /> : null}
                </div>
                <p className="mt-1 text-xs text-slate-500">{item.message}</p>
              </button>
            )) : <p className="text-sm text-slate-500">No notifications yet.</p>}
          </div>
        </div>
      ) : null}
    </div>
  );
}

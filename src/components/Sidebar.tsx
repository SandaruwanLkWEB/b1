import { NavLink } from 'react-router-dom';
import { menuByRole } from '../config/menu';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  const menu = user ? menuByRole[user.role] : [];

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white/80 px-4 py-6 backdrop-blur xl:block dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mb-8 px-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">Transport Ops</p>
        <h2 className="mt-2 text-xl font-semibold">Enterprise Workflow</h2>
      </div>
      <nav className="space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

import { LogOut, Moon, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import NotificationBell from './NotificationBell'

export default function Topbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const roleLabel = user?.role?.replace(/_/g, ' ') ?? ''

  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{user?.fullName}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{roleLabel}</p>
      </div>

      <div className="flex items-center gap-2">
        <NotificationBell />
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button
          type="button"
          onClick={() => {
            logout()
            navigate('/login')
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-900"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  )
}

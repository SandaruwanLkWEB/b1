import { Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';
import { Role } from './types';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DepartmentsPage from './pages/DepartmentsPage';
import EmployeesPage from './pages/EmployeesPage';
import UsersPage from './pages/UsersPage';
import RoutesPage from './pages/RoutesPage';
import PlacesPage from './pages/PlacesPage';
import VehiclesPage from './pages/VehiclesPage';
import DriversPage from './pages/DriversPage';
import RequestsPage from './pages/RequestsPage';
import ApprovalsPage from './pages/ApprovalsPage';
import GroupsPage from './pages/GroupsPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AuditLogsPage from './pages/AuditLogsPage';
import NotFoundPage from './pages/NotFoundPage';
import AnalyticsPage from './pages/AnalyticsPage';
import HolidaysPage from './pages/HolidaysPage';
import ArchivePage from './pages/ArchivePage';
import SelfServicePage from './pages/SelfServicePage';
import GroupingTemplatesPage from './pages/GroupingTemplatesPage';
import DriverMobilePage from './pages/DriverMobilePage';
import SelfRegisterPage from './pages/SelfRegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HelpDeskPage from './pages/HelpDeskPage';

const adminRoles: Role[] = ['ADMIN', 'SUPER_ADMIN'];
const placeRoles: Role[] = ['ADMIN', 'SUPER_ADMIN', 'HOD'];
const fleetRoles: Role[] = ['ADMIN', 'SUPER_ADMIN', 'TRANSPORT_AUTHORITY'];
const reportingRoles: Role[] = ['ADMIN', 'SUPER_ADMIN', 'HR', 'TRANSPORT_AUTHORITY', 'PLANNING'];
const userRoles: Role[] = ['ADMIN', 'SUPER_ADMIN', 'HOD', 'HR'];
const settingsRoles: Role[] = ['ADMIN', 'SUPER_ADMIN', 'PLANNING'];
const auditRoles: Role[] = ['ADMIN', 'SUPER_ADMIN', 'HR', 'PLANNING'];
const analyticsRoles: Role[] = ['ADMIN', 'SUPER_ADMIN', 'PLANNING', 'HR', 'TRANSPORT_AUTHORITY'];
const holidayRoles: Role[] = ['ADMIN', 'SUPER_ADMIN', 'PLANNING', 'HR', 'TRANSPORT_AUTHORITY'];
const archiveRoles: Role[] = ['ADMIN', 'SUPER_ADMIN', 'PLANNING'];
const templateRoles: Role[] = ['ADMIN', 'SUPER_ADMIN', 'PLANNING', 'TRANSPORT_AUTHORITY'];

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/self-register" element={<SelfRegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/help-desk" element={<HelpDeskPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppShell><DashboardPage /></AppShell>} />
        <Route path="/employees" element={<AppShell><EmployeesPage /></AppShell>} />
        <Route path="/requests" element={<AppShell><RequestsPage /></AppShell>} />
        <Route path="/approvals" element={<AppShell><ApprovalsPage /></AppShell>} />
        <Route path="/groups" element={<AppShell><GroupsPage /></AppShell>} />
        <Route path="/profile" element={<AppShell><ProfilePage /></AppShell>} />
        <Route path="/self-service" element={<AppShell><SelfServicePage /></AppShell>} />
      </Route>

      <Route element={<ProtectedRoute roles={userRoles} />}><Route path="/users" element={<AppShell><UsersPage /></AppShell>} /></Route>

      <Route element={<ProtectedRoute roles={adminRoles} />}>
        <Route path="/departments" element={<AppShell><DepartmentsPage /></AppShell>} />
        <Route path="/routes" element={<AppShell><RoutesPage /></AppShell>} />
      </Route>

      <Route element={<ProtectedRoute roles={settingsRoles} />}>
        <Route path="/settings" element={<AppShell><SettingsPage /></AppShell>} />
      </Route>

      <Route element={<ProtectedRoute roles={auditRoles} />}>
        <Route path="/audit-logs" element={<AppShell><AuditLogsPage /></AppShell>} />
      </Route>

      <Route element={<ProtectedRoute roles={placeRoles} />}>
        <Route path="/places" element={<AppShell><PlacesPage /></AppShell>} />
      </Route>

      <Route element={<ProtectedRoute roles={fleetRoles} />}>
        <Route path="/vehicles" element={<AppShell><VehiclesPage /></AppShell>} />
        <Route path="/drivers" element={<AppShell><DriversPage /></AppShell>} />
        <Route path="/driver-mobile" element={<AppShell><DriverMobilePage /></AppShell>} />
      </Route>

      <Route element={<ProtectedRoute roles={reportingRoles} />}>
        <Route path="/reports" element={<AppShell><ReportsPage /></AppShell>} />
      </Route>

      <Route element={<ProtectedRoute roles={analyticsRoles} />}>
        <Route path="/analytics" element={<AppShell><AnalyticsPage /></AppShell>} />
      </Route>

      <Route element={<ProtectedRoute roles={holidayRoles} />}>
        <Route path="/holidays" element={<AppShell><HolidaysPage /></AppShell>} />
      </Route>

      <Route element={<ProtectedRoute roles={archiveRoles} />}>
        <Route path="/archive" element={<AppShell><ArchivePage /></AppShell>} />
      </Route>

      <Route element={<ProtectedRoute roles={templateRoles} />}>
        <Route path="/grouping-templates" element={<AppShell><GroupingTemplatesPage /></AppShell>} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

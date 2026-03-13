export type Role = 'ADMIN' | 'HOD' | 'HR' | 'TRANSPORT_AUTHORITY' | 'EMP' | 'PLANNING' | 'SUPER_ADMIN';

export interface AuthUser {
  id?: number;
  sub?: number;
  email: string;
  role: Role;
  departmentId?: number | null;
  employeeId?: number | null;
  fullName: string;
  phone?: string;
  f2a_enabled?: boolean;
  emp_no?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface DashboardCard {
  label: string;
  value: string | number;
}

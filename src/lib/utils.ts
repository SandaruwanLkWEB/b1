import { clsx } from 'clsx';

export const cn = (...args: any[]) => clsx(args);

export function formatDate(value?: string | null) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString();
}

export function titleCase(input: string) {
  return input
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

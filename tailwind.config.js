/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        panel: '#ffffff',
        brand: '#2563eb',
        soft: '#f8fafc',
      },
      boxShadow: {
        panel: '0 18px 45px rgba(15, 23, 42, 0.08)',
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
};

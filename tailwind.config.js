/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        secondary: 'var(--color-secondary)',
        tertiary: 'var(--color-tertiary)',
        accent: 'var(--color-accent)',
        'bg-dark': 'var(--color-bg-dark)',
        'bg-dark-light': 'var(--color-bg-dark-light)',
        'text-light': 'var(--color-text-light)',
        'text-muted': 'var(--color-text-muted)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
      },
    },
  },
  plugins: [],
};
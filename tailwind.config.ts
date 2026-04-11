/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg)',
        foreground: 'var(--text)',
        card: 'var(--surface)',
        'card-foreground': 'var(--text)',
        popover: 'var(--surface)',
        'popover-foreground': 'var(--text)',
        primary: 'var(--brand)',
        'primary-foreground': '#ffffff',
        secondary: 'var(--surface-muted)',
        'secondary-foreground': 'var(--text)',
        muted: 'var(--surface-muted)',
        'muted-foreground': 'var(--muted)',
        accent: 'var(--surface-muted)',
        'accent-foreground': 'var(--text)',
        destructive: '#b42318',
        'destructive-foreground': '#ffffff',
        border: 'var(--line)',
        input: 'var(--line)',
        ring: 'var(--brand)',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
}
export default config

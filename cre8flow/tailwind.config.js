/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0f0f0f',
        surface: '#1a1a1a',
        border: '#2a2a2a',
        accent: '#7c3aed',
        'accent-light': '#a78bfa',
        muted: '#6b7280',
        hook: '#f59e0b',
        script: '#3b82f6',
        shoot: '#10b981',
        edit: '#f97316',
        publish: '#ec4899',
      },
      fontFamily: {
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['var(--font-nunito)', 'Nunito', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        kleo: {
          green: '#58CC02',
          'green-dark': '#3D9000',
          blue: '#1CB0F6',
          'blue-dark': '#0E86B8',
          yellow: '#FFC800',
          'yellow-dark': '#CC9E00',
          red: '#FF4B4B',
          purple: '#CE82FF',
        },
      },
      animation: {
        'bounce-once': 'bounce 0.5s ease-in-out',
        'pop-in': 'pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'slide-up': 'slide-up 0.35s ease-out forwards',
        'float-up': 'float-up 1.5s ease-out forwards',
      },
      keyframes: {
        'pop-in': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '70%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(30px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'float-up': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-60px)' },
        },
      },
      boxShadow: {
        'card-green': '0 6px 0 #3D9000',
        'card-blue': '0 6px 0 #0E86B8',
        'card-yellow': '0 6px 0 #CC9E00',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        void: { DEFAULT: '#080810', 50: '#0D0D1A', 100: '#0F0F1F', 200: '#141428', 300: '#1A1A35' },
        surface: { DEFAULT: '#111120', 50: '#16162A', 100: '#1C1C33' },
        violet: { 300: '#C4B5FD', 400: '#A78BFA', 500: '#8B5CF6', 600: '#7C3AED', 700: '#6D28D9' },
        indigo: { 400: '#818CF8', 500: '#6366F1' },
        silver: { DEFAULT: '#9CA3AF', light: '#D1D5DB' },
        frost: { DEFAULT: 'rgba(255,255,255,0.06)', hover: 'rgba(255,255,255,0.10)', border: 'rgba(255,255,255,0.08)' },
      },
      backgroundImage: {
        'ambient': 'radial-gradient(ellipse at 20% 40%, rgba(139,92,246,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 10%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(ellipse at 60% 90%, rgba(16,185,129,0.05) 0%, transparent 40%)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)',
        'violet-glow': 'radial-gradient(circle at center, rgba(139,92,246,0.3) 0%, transparent 70%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'glass-lg': '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)',
        'glow-violet': '0 0 30px rgba(139,92,246,0.25), 0 0 60px rgba(139,92,246,0.08)',
        'glow-green': '0 0 20px rgba(16,185,129,0.3), 0 0 40px rgba(16,185,129,0.08)',
        'glow-red': '0 0 20px rgba(239,68,68,0.3)',
      },
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        breathe: { '0%,100%': { transform: 'scale(1)', opacity: '0.9' }, '50%': { transform: 'scale(1.015)', opacity: '1' } },
        floatSlow: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        pulseGlow: { '0%,100%': { opacity: '0.4' }, '50%': { opacity: '0.9' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        gradientShift: { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
      fontFamily: { sans: ['var(--font-inter)', 'system-ui', 'sans-serif'] },
      backdropBlur: { xs: '4px' },
    },
  },
  plugins: [],
};
export default config;

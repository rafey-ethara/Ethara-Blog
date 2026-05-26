import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base
        bg: {
          primary: '#0A0A14',
          secondary: '#13131F',
          card: '#1A1A2E',
          elevated: '#212136',
        },
        // Accent
        violet: {
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        // Amber accent
        amber: {
          400: '#FCD34D',
          500: '#F59E0B',
        },
        // Text
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
        // Border
        border: {
          DEFAULT: '#2D2D44',
          subtle: '#1E1E2E',
        },
        // Status
        success: '#10B981',
        error: '#F43F5E',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          from: { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          to: { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-hero': 'linear-gradient(135deg, #0A0A14 0%, #1A0A2E 50%, #0A1420 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(33, 33, 54, 0.6))',
        'gradient-violet': 'linear-gradient(135deg, #6366F1, #8B5CF6)',
        'gradient-amber': 'linear-gradient(135deg, #F59E0B, #FCD34D)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 40px rgba(139, 92, 246, 0.2)',
        glow: '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-strong': '0 0 40px rgba(139, 92, 246, 0.5)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;

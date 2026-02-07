/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0D0D0F',
          secondary: '#161618',
          tertiary: '#1E1E22',
          card: '#1A1A1E',
          hover: '#252529',
        },
        accent: {
          gold: '#F5C842',
          blue: '#3B82F6',
          purple: '#8B5CF6',
          pink: '#EC4899',
          red: '#EF4444',
          orange: '#F59E0B',
          teal: '#14B8A6',
          indigo: '#6366F1',
          green: '#10B981',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#9CA3AF',
          muted: '#6B7280',
        },
        border: {
          subtle: 'rgba(255,255,255,0.06)',
          medium: 'rgba(255,255,255,0.12)',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'level-up': 'levelUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        pulseGlow: { '0%, 100%': { boxShadow: '0 0 5px rgba(245,200,66,0.3)' }, '50%': { boxShadow: '0 0 20px rgba(245,200,66,0.6)' } },
        levelUp: { '0%': { transform: 'scale(0.8)', opacity: '0' }, '50%': { transform: 'scale(1.1)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
      },
    },
  },
  plugins: [],
};

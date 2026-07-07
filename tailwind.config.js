/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./apps/web/src/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      colors: {
        void: '#030014',
        'void-900': '#09090b',
        'void-800': '#131315',
        'surface-glass': 'rgb(255 255 255 / 0.055)',
        'surface-line': 'rgb(255 255 255 / 0.12)',
        'matrix-green': '#00ff41',
        'electric-cyan': '#00f1fe',
        'signal-purple': '#741dff',
        'text-primary': '#e5e1e4',
        'text-muted': '#b9ccb2',
      },
      fontFamily: {
        sans: [
          'Geist Variable',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'Geist Mono Variable',
          'SFMono-Regular',
          'Consolas',
          'Liberation Mono',
          'monospace',
        ],
      },
      boxShadow: {
        'cyan-glow': '0 0 28px rgb(0 241 254 / 0.22)',
        'green-glow': '0 0 28px rgb(0 255 65 / 0.2)',
        'purple-glow': '0 0 40px rgb(116 29 255 / 0.2)',
      },
      backgroundImage: {
        'hero-grid':
          'linear-gradient(rgb(255 255 255 / 0.045) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.045) 1px, transparent 1px)',
        'scan-line':
          'linear-gradient(90deg, transparent, rgb(0 241 254 / 0.22), transparent)',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.25)' },
        },
      },
      animation: {
        scan: 'scan 4s linear infinite',
        'pulse-glow': 'pulseGlow 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

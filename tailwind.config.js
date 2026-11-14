export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        space: { 950: '#02050f', 900: '#060d1f', 800: '#0d1b3e', 700: '#132252', 600: '#1a2d6b' },
        neon: { blue: '#00d4ff', green: '#00ff88', yellow: '#ffcc00', red: '#ff3366', purple: '#a855f7' }
      },
      fontFamily: { mono: ['JetBrains Mono', 'Courier New', 'monospace'] },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00d4ff, 0 0 10px #00d4ff' },
          '100%': { boxShadow: '0 0 20px #00d4ff, 0 0 40px #00d4ff, 0 0 60px #00d4ff' }
        }
      }
    }
  },
  plugins: []
}

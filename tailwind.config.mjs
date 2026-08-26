export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0d14',
          card: '#111726',
          panel: '#161f36',
          border: '#1f2d4d',
          accent: '#00ff9d',
          glow: '#00e5ff',
          danger: '#ff3366',
          warning: '#ffb703',
          purple: '#9d4edd'
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      boxShadow: {
        'neon-green': '0 0 15px rgba(0, 255, 157, 0.3)',
        'neon-blue': '0 0 15px rgba(0, 229, 255, 0.3)',
        'neon-danger': '0 0 15px rgba(255, 51, 102, 0.3)'
      }
    }
  },
  plugins: []
};

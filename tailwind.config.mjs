export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#08070d',
          card: '#100c1c',
          panel: '#171228',
          border: '#271d42',
          borderHover: '#4a3375',
          accent: '#c084fc',
          purple: '#a855f7',
          darkPurple: '#581c87',
          pink: '#f472b6',
          pastelPink: '#fbcfe8',
          glow: '#f472b6',
          danger: '#fb7185',
          warning: '#fcd34d'
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      boxShadow: {
        'neon-purple': '0 0 20px rgba(192, 132, 252, 0.35)',
        'neon-pink': '0 0 20px rgba(244, 114, 182, 0.35)',
        'neon-glow': '0 0 25px rgba(244, 114, 182, 0.25)'
      }
    }
  },
  plugins: []
};

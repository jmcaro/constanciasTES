/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'te-blue':        '#4995F3',
        'te-blue-mid':    '#4977DC',
        'te-blue-dark':   '#2E6FCC',
        'te-yellow':      '#F1C717',
        'te-ink':         '#0F1B2D',
        'te-blue-light':  '#EEF4FF',
        'te-bg':          '#F4F6FA',
        'te-text':        '#222222',
        'te-muted':       '#666666',
      },
      backgroundImage: {
        'te-gradient':   'linear-gradient(135deg, #4995F3 0%, #4977DC 100%)',
        'te-gradient-h': 'linear-gradient(90deg, #4995F3 0%, #4977DC 100%)',
      },
      fontFamily: {
        sans: ['Montserrat', 'Open Sans', 'Segoe UI', 'Arial', 'sans-serif'],
        display: ['Montserrat', 'Arial', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}

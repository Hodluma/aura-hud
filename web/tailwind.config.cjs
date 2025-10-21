module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          primary: '#4f46e5',
          neon: '#00f3ff'
        }
      },
      fontFamily: {
        display: ['"Rajdhani"', 'sans-serif']
      }
    }
  },
  plugins: []
}


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4'
        },
        'pw-gold': '#D6A446',
        'deep-charcoal': '#1F2937'
      },
      borderRadius: {
        '3xl': '24px'
      },
      boxShadow: {
        'soft-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.03), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        'deep-gold': '0 25px 50px -12px rgba(214, 164, 70, 0.15)',
      }
    },
  },
  plugins: [],
}

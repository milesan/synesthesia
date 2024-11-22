/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Space Mono', 'monospace'],
        display: ['VT323', 'monospace'],
        serif: ['Playfair Display', 'serif'],
        body: ['Lora', 'serif']
      }
    },
  },
  plugins: [],
};
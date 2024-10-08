/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./renderer/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rm-blue-100': '#367CF4',
        'rm-blue-200': '#367CC8',
      },
    },
  },
  plugins: [],
}
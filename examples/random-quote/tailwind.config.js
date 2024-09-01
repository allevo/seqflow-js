/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './src/**/*.{js,jsx,ts,tsx,css}',
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require("@tailwindcss/typography"),
    ],
}
  
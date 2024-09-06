/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './src/domains/counter/components/*.{js,jsx,ts,tsx}',
      './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require("@tailwindcss/typography"),
    ],
}
  
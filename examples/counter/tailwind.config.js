/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './src/domains/counter/components/*.{js,jsx,ts,tsx}',
      './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
      extend: {},
    },
    daisyui: {
      styled: true,
      themes: false,
      base: true,
      utils: true,
      logs: true,
      rtl: false,
      prefix: ""
    },
    plugins: [
      require("@tailwindcss/typography"),
    ],
}
  
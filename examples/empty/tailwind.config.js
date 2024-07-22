/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './src/**/*.{js,jsx,ts,tsx,css}',
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
      require('daisyui')
    ],
}
  
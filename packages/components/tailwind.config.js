/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx,css}',
    './src/**/*.stories.tsx',
    './.storybook/**/*.{js,jsx,ts,tsx,mdx}',
    './stories/**/*.{js,jsx,ts,tsx,mdx}',
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

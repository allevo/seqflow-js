/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx,css}',
    './.storybook/**/*.{js,jsx,ts,tsx,mdx}',
    './stories/**/*.{js,jsx,ts,tsx,mdx}',
    './src/Button/Button.stories.tsx'
  ],

  theme: {
    extend: {},
  },
  // TODO: remove this safelist
  // it should be automatically detected, but it is not
  safelist: [
    {
      pattern: /(btn|input|bg|w-full|grid|card|shadow|center)/,
    }
  ],
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

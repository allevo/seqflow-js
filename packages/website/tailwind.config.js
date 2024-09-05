/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './src/components/*.{js,jsx,ts,tsx,css,md,mdx}',
      './src/pages/*.{js,jsx,ts,tsx,css,md,mdx}',
      './src/public/*.{js,jsx,ts,tsx,css,md,mdx}',
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require("@tailwindcss/typography"),
    ],
}
  
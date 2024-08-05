/** @type { import('@storybook/html').Preview } */

import '../dist/style.css';

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // darkMode: {
    //   classTarget: 'html',
    //   // Override the default dark theme
    //   dark: { ...themes.dark, appBg: 'black' },
    //   // Override the default light theme
    //   light: { ...themes.normal, appBg: 'red' }
    // }
  },
};

export default preview;

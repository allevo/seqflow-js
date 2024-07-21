import { join, dirname } from "path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}

/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: [
    "../stories/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)",
  ],
  addons: [
    // getAbsolutePath("@storybook/addon-links"),
    // getAbsolutePath("@storybook/addon-essentials"),
    // getAbsolutePath("@chromatic-com/storybook"),
    // getAbsolutePath("@storybook/addon-interactions"),
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-themes',
      options: {
        implementation: require("postcss"),
      },
    },
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false
      }
    },
  ],
  core: {
    builder: '@storybook/builder-vite', // 👈 The builder enabled here.
  },
  framework: {
    name: getAbsolutePath("seqflow-js-storybook"),
    options: {},
  },
};
export default config;

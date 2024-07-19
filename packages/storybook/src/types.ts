import type { StorybookConfig as StorybookConfigBase, CompatibleString, WebRenderer, ArgsStoryFn, Args, AnnotatedStoryFn } from '@storybook/types';
import type { StorybookConfigVite, BuilderOptions } from '@storybook/builder-vite';
import { ArgTypesExtractor } from '@storybook/docs-tools';

type FrameworkName = CompatibleString<'@storybook/html-vite'>;
type BuilderName = CompatibleString<'@storybook/builder-vite'>;

export type FrameworkOptions = {
  builder?: BuilderOptions;
};

type StorybookConfigFramework = {
  framework:
    | FrameworkName
    | {
        name: FrameworkName;
        options: FrameworkOptions;
      };
  core?: StorybookConfigBase['core'] & {
    builder?:
      | BuilderName
      | {
          name: BuilderName;
          options: BuilderOptions;
        };
  };
};

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export type StorybookConfig = Omit<
  StorybookConfigBase,
  keyof StorybookConfigVite | keyof StorybookConfigFramework
> &
  StorybookConfigVite &
  StorybookConfigFramework;


export interface HtmlRenderer extends WebRenderer {
  component: string | HTMLElement | ArgsStoryFn<HtmlRenderer>;
  storyResult: StoryFnHtmlReturnType;
}
export type StoryFnHtmlReturnType = string | Node;


export interface Parameters {
  renderer: 'seqflow-js-storybook';
  docs?: {
    story: { inline: boolean };
    renderer?: any,
    extractArgTypes?: ArgTypesExtractor;
    source: {
      type: 'dynamic';
      language: 'jsx';
      code: any;
      excludeDecorators: any;
    };
  };
}

export type StoryFn<TArgs = Args> = AnnotatedStoryFn<HtmlRenderer, TArgs>;

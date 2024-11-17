import type { StorybookConfig as StorybookConfigBase, WebRenderer, ArgsStoryFn, Args, AnnotatedStoryFn, PlayFunctionContext, StoryContext } from '@storybook/types';
import type { StorybookConfigVite, BuilderOptions } from '@storybook/builder-vite';
import { ArgTypesExtractor } from '@storybook/docs-tools';
import { SeqFlowComponent } from '@seqflow/seqflow';

export type FrameworkOptions = {
  builder?: BuilderOptions;
};


/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export type StorybookConfig = Omit<
  StorybookConfigBase,
  keyof StorybookConfigVite
> &
  StorybookConfigVite;


export type StoryFnHtmlReturnType = Promise<void>;
export interface SeqFlowJSRenderer extends WebRenderer {
  component: SeqFlowComponent<object>;
  storyResult: StoryFnHtmlReturnType;
}

export interface Parameters {
  renderer: '@seqflow/storybook';
  docs?: {
    story: { inline: boolean };
    extractArgTypes?: ArgTypesExtractor;
    source: {
      type: 'dynamic';
      language: 'jsx';
      code: any;
      excludeDecorators: any;
    };
  };
}

export type StoryFn<TArgs extends object = Args> = SeqFlowComponent<TArgs> | {
  play: (context: StoryContext<SeqFlowJSRenderer, TArgs>) => Promise<void> | void;
  component?: SeqFlowComponent<TArgs>,
  args?: TArgs;
}

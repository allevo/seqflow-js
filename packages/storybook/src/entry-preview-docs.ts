import type { ArgTypesEnhancer, DecoratorFunction } from '@storybook/types';
import { enhanceArgTypes } from '@storybook/docs-tools';

import { sourceDecorator } from './docs/sourceDecorator.js';
import type { SeqFlowJSRenderer, Parameters } from './types';
import { ArgTypesExtractor } from '@storybook/docs-tools';

export const decorators: DecoratorFunction<SeqFlowJSRenderer>[] = [sourceDecorator];

const extractArgTypes: ArgTypesExtractor = (component) => {
  if (!component.__storybook) {
    console.log('Component does not have __storybook prop', component);
    return;
  }

  return component.__storybook.props
}

export const parameters: Parameters = {
  renderer: '@seqflow/storybook',
  docs: {
    story: { inline: true },
    extractArgTypes,
    source: {
      type: 'dynamic',
      language: 'jsx',
      code: undefined,
      excludeDecorators: undefined,
    },
  },
};

export const argTypesEnhancers: ArgTypesEnhancer[] = [enhanceArgTypes];

export { render } from './render';

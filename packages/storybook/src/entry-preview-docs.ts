import type { ArgTypesEnhancer, DecoratorFunction } from '@storybook/types';
import { enhanceArgTypes } from '@storybook/docs-tools';

import { sourceDecorator } from './docs/sourceDecorator.js';
import type { HtmlRenderer, Parameters } from './types';
import { type PropDef, hasDocgen, extractComponentProps, TypeSystem, ArgTypesExtractor, DocgenInfo } from '@storybook/docs-tools';

export const decorators: DecoratorFunction<HtmlRenderer>[] = [sourceDecorator];


const extractArgTypes: ArgTypesExtractor = (component) => {
  if (!component.__storybook) {
    console.log('Component does not have __storybook prop', component);
    return;
  }

  return component.__storybook.props
}

export const parameters: Parameters = {
  renderer: 'seqflow-js-storybook',
  docs: {
    story: { inline: true },
    /*
    renderer: () => {
      console.log('renderer')
      return {
          render: (a, b, c) => {
              console.log('render', a, b, c)
          }
      }
    },
    */
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

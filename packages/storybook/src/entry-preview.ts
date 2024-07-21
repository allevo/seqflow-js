import { DocsContext } from '@storybook/preview-api';
import { renderToCanvas } from './render';
import type { Parameters } from './types';

export const parameters: Parameters = {
    renderer: 'seqflow-js-storybook',
    docs: {
        story: { inline: true },
        source: {
            type: 'dynamic',
            language: 'jsx',
            code: undefined,
            excludeDecorators: undefined,
        }
    }
};

export { render } from './render';
export { renderToCanvas } from './render';

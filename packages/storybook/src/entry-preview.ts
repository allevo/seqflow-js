import { DocsContext } from '@storybook/preview-api';
import { renderToCanvas } from './render';
import type { Parameters } from './types';

export const parameters: Parameters = {
    renderer: 'seqflow-js-storybook',
    docs: {
        story: { inline: true },
        /*
        renderer: () => {
            console.log('renderer')
            return {
                render: async (context: DocsContext<any>, storyContext: any, canvasElement: HTMLElement) => {
                    console.log(context, storyContext)

                    const b = context.componentStories()

                    console.log(b)

                    console.log('rAAAAAender', {context, canvasElement})
                    canvasElement.innerHTML = 'pippo'
                }
            }
        },
        */
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

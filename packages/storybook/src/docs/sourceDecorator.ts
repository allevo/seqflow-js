
import type { DecoratorFunction } from '@storybook/types';

import type { SeqFlowJSRenderer } from '../types';
import { Contexts, start } from '@seqflow/seqflow';

export const sourceDecorator: DecoratorFunction<SeqFlowJSRenderer> = async () => {
  
};

async function App({ component: comp, args }: any, { component }: Contexts) {
  const r: Element = component.createDOMElement(comp, args) as Element;
  component.renderSync(r as any);
}

export function buildComponent(component: any, args: any) {
  const root = document.createElement('div');
  start(root, App, { component, args }, {
    log: console,
    domains: {},
  });
  return root;
}
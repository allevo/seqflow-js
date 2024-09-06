
import type { DecoratorFunction } from '@storybook/types';

import type { SeqFlowJSRenderer } from '../types';
import { SeqflowFunctionContext, start } from 'seqflow-js';

export const sourceDecorator: DecoratorFunction<SeqFlowJSRenderer> = async () => {
  
};

async function App(this: SeqflowFunctionContext, { component, args }: any) {
  const r: Element = this.createDOMElement(component, args) as Element;
  this.renderSync(r as any);
}

export function buildComponent(component: any, args: any) {
  const root = document.createElement('div');
  start(root, App, { component, args }, { });
  return root;
}
import { global } from '@storybook/global';

import { dedent } from 'ts-dedent';
import { simulatePageLoad, simulateDOMContentLoaded } from '@storybook/preview-api';
import type { RenderContext } from '@storybook/types';
import type { HtmlRenderer } from './types';
import { SeqflowFunctionContext, start } from 'seqflow-js';
import { Component } from '@storybook/docs-tools';

const { Node } = global;

export const render = (args: any, context: any) => {
  const { component: Component } = context;

  return {
    component: Component,
    args
  }

  // showMain();

  /*
  const { id, component: Component } = context;

  if (typeof Component === 'string') {
    let output = Component;
    Object.keys(args).forEach((key) => {
      output = output.replace(`{{${key}}}`, args[key]);
    });
    return output;
  }
  if (Component instanceof HTMLElement) {
    const output = Component.cloneNode(true) as HTMLElement;
    Object.keys(args).forEach((key) => {
      output.setAttribute(
        key,
        typeof args[key] === 'string' ? args[key] : JSON.stringify(args[key])
      );
    });

    return output;
  }
  if (typeof Component === 'function') {
    return Component(args, context);
  }

  console.warn(dedent`
    Storybook's HTML renderer only supports rendering DOM elements and strings.
    Received: ${Component}
  `);
  throw new Error(`Unable to render story ${id}`);
  */
};

export function renderToCanvas(
  { storyFn, kind, name, showMain, showError, forceRemount, storyContext, ...other }: RenderContext<HtmlRenderer>,
  canvasElement: HtmlRenderer['canvasElement']
) {

  const Component = storyContext?.component;
  if (Component) {
    canvasElement.innerHTML = '';

    // @ts-ignore
    const r = storyContext.originalStoryFn(storyContext.args, storyContext)

    if (r instanceof Node) {
      canvasElement.appendChild(r);
      // @ts-ignore
    } else if (typeof r === 'object' && r.component && r.args) {
      // @ts-ignore
      const c = buildComponent(r.component, r.args)
      canvasElement.appendChild(c);
    } else {
      console.log(r)
      throw new Error(`Unsupported element type: ${r}`);
    }
  } else {
    const element = storyFn();

    if (element instanceof Node) {

      canvasElement.innerHTML = '';
      canvasElement.appendChild(element);
      simulateDOMContentLoaded();
    } else if (typeof element === 'function') {
      canvasElement.innerHTML = '';
      canvasElement.appendChild(buildComponent(element, {}));
    } else {
      console.log(element)
      throw new Error(`Unsupported element type: ${element}`);
    }
  }

  showMain();
}

async function App(this: SeqflowFunctionContext, { component, args }: any) {
  const r: Element = this.createDOMElement(component, args) as Element;
  this.renderSync(r as any);
}

export function buildComponent(component: any, args: any) {
  const root = document.createElement('div');
  start(root, App, { component, args }, {
    log: console
  });
  return root;
}

import { global } from '@storybook/global';

import { dedent } from 'ts-dedent';
import { simulatePageLoad, simulateDOMContentLoaded } from '@storybook/preview-api';
import type { RenderContext } from '@storybook/types';
import type { SeqFlowJSRenderer } from './types';
import { Contexts, start } from '@seqflow/seqflow';
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

const AsyncFunction = async function () {}.constructor;

export function renderToCanvas(
  { storyFn, kind, name, showMain, showError, forceRemount, storyContext, ...other }: RenderContext<SeqFlowJSRenderer>,
  canvasElement: SeqFlowJSRenderer['canvasElement'],
) {
  const exportedModule = storyContext?.moduleExport

  const Component = exportedModule?.component || storyContext?.component;
  if (exportedModule && (exportedModule instanceof AsyncFunction)) {
    canvasElement.innerHTML = '';

    const c = buildComponent(exportedModule, storyContext.args);
    canvasElement.appendChild(c);
  } else if (Component) {
    if (!(Component instanceof AsyncFunction)) {
      console.error('Invalid component', Component);
      throw new Error(`Invalid component: ${Component}. Expected AsyncFunction \`async function(this: SeqflowFunctionContext, args: any) { ... }\``);
    }
    canvasElement.innerHTML = '';

    const c = buildComponent(Component, storyContext.args);
    canvasElement.appendChild(c);
  } else {
    console.error('Unsupported element type', Component);
    throw new Error(`Unsupported element type: ${Component}`);
  }

  showMain();
  
}

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

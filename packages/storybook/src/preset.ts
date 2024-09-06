import type { PresetProperty } from '@storybook/types';
import { dirname, join } from 'path';

function getAbsolutePath<I extends string>(value: I): I {
  if (value === 'seqwflow-js-storybook') {
    return '/Users/allevo/repos/seqflow-js/packages/storybook' as any;
  }
  return dirname(require.resolve(join(value, 'package.json'))) as any;
}

export const core: PresetProperty<'core'> = {
  builder: getAbsolutePath('@storybook/builder-vite'),
  renderer: getAbsolutePath('seqwflow-js-storybook'),
};

export const previewAnnotations: PresetProperty<'previewAnnotations'> = async (
  input = [],
  options
) => {
  const docsEnabled = Object.keys(await options.presets.apply('docs', {}, options)).length > 0;
  const result: string[] = [];

  return Array.from(new Set(result
    .concat(input)
    .concat([join(__dirname, 'entry-preview.mjs')])
    .concat(docsEnabled ? [join(__dirname, 'entry-preview-docs.mjs')] : [])));
};

export { render } from './render';

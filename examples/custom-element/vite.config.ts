import { resolve } from 'node:path'
import type { ConfigEnv } from 'vite';
import type { PluginOption } from 'vite';
import { defineConfig } from "vite";
import checker from 'vite-plugin-checker'

export default defineConfig((configEnv: ConfigEnv) => {
    const withShadowDom = configEnv.mode !== 'development';
    return {
        root: "src",
        plugins: [
            checker({
                typescript: true,
            }),
            cssInjectedByJsPlugin({
                injectFunction: (css) => {
                    return `
function injectCSS(el) {
    const style = document.createElement('style');
    style.innerHTML = \`${css.replace(/`/g, '\\`').replace(/:root/g, ':host')}\`;
    el.appendChild(style);
}
    `.split('\n').map(i => i.trim()).join('');
                }
            }) as PluginOption,
        ],
        build: {
            emptyOutDir: true,
            outDir: resolve(__dirname, 'dist'),
            lib: {
                entry: resolve(__dirname, 'src/index.ts'),
                formats: ['es' as const],
                name: 'index',
                fileName: 'index',
            },
        },

        define: {
            'shadowDomMode': withShadowDom ? '"closed"': false
        }
    }
});

type InjectFunction = (css: string) => string;
async function globalCssInjection(bundle, cssAssets, injectFunction: InjectFunction) {
    const jsAssetToInject = Object.keys(bundle).find((i) => {
        const asset = bundle[i];
        return asset.fileName.endsWith('.js') && asset.isEntry;
    });
    if (!jsAssetToInject) {
        throw new Error('Unable to locate the JavaScript asset for adding the CSS injection code. It is recommended to review your configurations.')
    }

    const allCSS = cssAssets.reduce((acc, cssName) => {
        const cssSource = bundle[cssName].source;
        delete bundle[cssName];
        return acc + cssSource;
    }, '');

    bundle[jsAssetToInject].code = `${injectFunction(allCSS)}
${bundle[jsAssetToInject].code}`;
}

export function warnLog(msg) {
    console.warn(`\x1b[33m \n${msg} \x1b[39m`);
}
function cssInjectedByJsPlugin({ injectFunction }: {
    injectFunction: InjectFunction
}) {
    // biome-ignore lint/suspicious/noExplicitAny: don't care about the type of config
    let config: any;
    const plugins = [
        {
            apply: 'build',
            enforce: 'post',
            name: 'vite-plugin-css-injected-by-js',
            config(config, env) {
                if (env.command === 'build') {
                    if (!config.build) {
                        config.build = {};
                    }
                }
            },
            configResolved(_config) {
                config = _config;
            },
            async generateBundle(opts, bundle) {
                const cssAssets = Object.keys(bundle).filter((i) => {
                    const asset = bundle[i];
                    return asset.type === 'asset' && asset.fileName.endsWith('.css')
                });

				if (cssAssets.length === 0) {
					warnLog('No CSS assets found in the bundle.');
					return;
				}
				if (cssAssets.length > 1) {
					warnLog('More than 1 CSS assets found in the bundle. This plugin is designed to work with 1 CSS asset only.');
					return;
				}

				await globalCssInjection(bundle, cssAssets, injectFunction);
            },
        },
    ];
    return plugins;
}

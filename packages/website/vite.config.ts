import { defineConfig, Plugin } from "vite";
import vite from 'vite'
import MarkdownIt from 'markdown-it'
import checker from 'vite-plugin-checker'
import { PurgeCSS, RawContent } from "purgecss";
import { JSDOM, VirtualConsole } from "jsdom"
import http from 'node:http'
import {readFileSync} from 'node:fs'
import { minify } from 'html-minifier'

export default defineConfig({
	root: "src",
	plugins: [
		generateAllPages(),
		checker({ typescript: true }),
		loadMarkdownPlugin({
			components: [
				{
					tag: 'card',
					open: '<div class="card text-bg-light"><div class="card-body">',
					close: '</div></div>'
				},
				{
					tag: 'next-steps-url',
					open: '<a href="',
					close: '">Next Steps</a>'
				},
				{
					tag: 'next-steps-text',
					open: '<p class="text-center">',
					close: '</p>'
				},
				{
					tag: 'next',
					mapFn: (content) => {
						try {
							const { label, next } = JSON.parse(content)
							return `<div class="flex" style="flex-direction: row-reverse">
    <a href="${next}" class="btn btn-ghost">${label}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style="width: 10px; fill: var(--tw-prose-body);">
            <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
        </svg>
    </a>
</div>`	
						} catch(e) {
							console.log(e, content);
							return content;
						}
					},
				}
			]
		}),
		loadSVG(),
	],
	build: {
		outDir: "../dist",
	},
	optimizeDeps: {
		exclude: ['prism']
	},
});


function loadSVG() {
	return  {
		name: 'seqflow-svg',
		enforce: 'pre' as const,
		// enforce: 'pre' as const,
		transform (_, id) {
			// If it's not a .md file, we can just skip this
			if (!id.endsWith('.svg')) {
				return null
			}

			const content = readFileSync(id, 'utf-8')

			return {
				code: `export default function (width, height) { return \`${content}\` }`,
			}
		},
	}
}


function loadMarkdownPlugin({ components }: {
	components: ({
		tag: string,
		open: string,
		close: string
	} | { tag: string, mapFn: (_: string) => string })[],
}) {
	return  {
		name: 'seqflow-markdown',
		enforce: 'pre' as const,
		transform (code, id) {
			// If it's not a .md file, we can just skip this
			if (!id.endsWith('.md')) {
				return null
			}

			const md = new MarkdownIt({
				html: true,
			})

			let html = md.render(code)
			// component replacement
			for (const component of components) {
				const { tag } = component

				if ('mapFn' in component) {
					const p = new RegExp(`:::${tag}:::\\s*([\\s\\S]*?)\\s*:::end-${tag}:::`)
					while (true) {
						const match = html.match(p)
						if (!match) {
							break;
						}
						const [textToReplace, content] = match
						html = html.replace(textToReplace, component.mapFn(content.replace(/&quot;/g, '"')))
					}
				} else {
					const {open, close} = component
					html = html.replace(new RegExp(`:::${tag}:::`, 'g'), open)
						.replace(new RegExp(`:::end-${tag}:::`, 'g'), close)
				}
			}

			const toc: any[] = []
			// add id to all h2 and h3
			html = html.replace(/<h(\d)>/g, (match, m, index) => {
				const aa = html.slice(index + 3).match(`</h${m}>`)
				const title = html.slice(index + 4, aa.index + index + 3)

				const last = toc[toc.length - 1]
				let slug = title.toLowerCase().replace(/ /g, '-')
				if (last && last.level < Number(m)) {
					slug = last.slug + '-' + slug
				}
				
				toc.push({ slug, title, type: 'h' + m, level: Number(m) })
				return `<h${m} id="${slug}">`
			})

			return {
				code: `
export const html = \`${html}\`
export const toc = ${JSON.stringify(toc)}
`,
			}
		},
	}
}

function generateAllPages(): Plugin {
	return {
		name: 'generate-all-pages',
		enforce: "post" as const,
		async generateBundle(this: vite.Rollup.PluginContext,
			options: vite.Rollup.NormalizedOutputOptions,
			bundle: vite.Rollup.OutputBundle,
			isWrite: boolean)
		{
			const virtualConsole = new VirtualConsole();
			virtualConsole.on("error", (...args) => { console.log('console.log', args) });
			virtualConsole.on("warn", (...args) => { console.log('console.log', args) });
			virtualConsole.on("info", (...args) => { console.log('console.log', args) });
			virtualConsole.on("dir", (...args) => { console.log('console.log', args) });

			const server = http.createServer(async (req, res) => {
				if (!req.url) {
					throw new Error('No url')
				}
				let r = ''

				const el = bundle[req.url.slice(1)]
				if (el.type === 'asset') {
					r = el.source.toString()
				} else if (el.type === 'chunk') {
					r = el.code
				}
				res.end(r);
			})
			await new Promise((res) => server.listen(() => res(void 0)))
			const port = (server.address() as any).port
			const baseUrl = `http://localhost:${port}`
			
			const indexHtml = bundle['index.html']
			if (indexHtml.type !== 'asset') {
				throw new Error('No index.html found')
			}
			const html = indexHtml.source.toString()
			const htmlWithoutTypeModule = html.replace(/type="module"/g, 'defer')

			const pages = [
				{
					path: '/',
					filename: 'index.html'
				},
				/*
				{
					path: '/why',
					filename: 'why.html'
				},
				{
					path: '/getting-started',
					filename: 'getting-started.html'
				},
				{
					path: '/getting-started/prerequisites',
					filename: 'getting-started/prerequisites.html'
				},
				{
					path: '/getting-started/fetch-data',
					filename: 'getting-started/fetch-data.html'
				},
				{
					path: '/getting-started/split-components',
					filename: 'getting-started/split-components.html'
				},
				{
					path: '/getting-started/refresh-quote',
					filename: 'getting-started/refresh-quote.html'
				},
				{
					path: '/getting-started/configuration',
					filename: 'getting-started/configuration.html'
				},
				{
					path: '/getting-started/test',
					filename: 'getting-started/test.html'
				},
				{
					path: '/api-reference',
					filename: 'api-reference.html'
				},
				{
					path: '/examples',
					filename: 'examples.html'
				}
				*/
			]
			for (const page of pages) {
				const dom = new JSDOM(htmlWithoutTypeModule, {
					resources: "usable",
					runScripts: "dangerously",
					url: `${baseUrl}${page.path}`,
					virtualConsole
				});
				await new Promise((resolve) => setTimeout(resolve, 1_000))

				const resultHtml = dom.serialize()
				const resultHTMWithoutScripts = resultHtml
					.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>/gi, (match) => {
						if (match.includes('data-keep="true"')) {
							return match
						}
						return ''
					})
					.replace('<link rel="custom">', `
<script type="module" defer src="/_vercel/insights/script.js"></script>
<script type="module" defer src="/_vercel/speed-insights/script.js"></script>
<script type="module">
    window.addEventListener('load', () => {
        const buttons = document.querySelectorAll('button.copy-to-clipboard-button')
        for (const button of buttons) {
            button.addEventListener('click', async () => {
                const text = button.closest('.code-toolbar')?.querySelector('pre')?.innerText
                if (!text) {
                    console.log('No text to copy')
                    return
                }
                await navigator.clipboard.writeText(text)
                button.innerText = 'Copied!'
                setTimeout(() => {
                    button.innerText = 'Copy'
                }, 1_000)
            })
        }
    })
</script>
`)

				const result = minify(resultHTMWithoutScripts, {
					html5: true,
					collapseWhitespace: true,
					removeAttributeQuotes: true
				});

				bundle[page.filename] = {
					type: 'asset',
					fileName: page.filename,
					name: undefined,
					originalFileName: '',
					source: result,
					needsCodeReference: false,
				}
			}

			server.close()
		}
	}
}

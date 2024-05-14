import { defineConfig } from "vite";
import MarkdownIt from 'markdown-it'
import pluginPurgeCss from "@mojojoejo/vite-plugin-purgecss";
import fs from 'fs'

export default defineConfig({
	root: "src",
	plugins: [
		pluginPurgeCss(),
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

			const content = fs.readFileSync(id, 'utf-8')

			return {
				code: `export default function (width, height) { return \`${content}\` }`,
			}
		},
	}
}


function loadMarkdownPlugin({ components }: { components: { tag: string, open: string, close: string }[] }) {
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
				const { tag, open, close } = component
				html = html.replace(new RegExp(`:::${tag}:::`, 'g'), open)
					.replace(new RegExp(`:::end-${tag}:::`, 'g'), close)
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

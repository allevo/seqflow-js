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
				}
			]
		}),
		loadSVG(),
	],
	build: {
		outDir: "../dist",
	},
});


function loadSVG() {
	return  {
		name: 'seqflow-svg',
		enforce: 'pre' as const,
		// enforce: 'pre' as const,
		transform (code, id) {
			// If it's not a .md file, we can just skip this
			if (!id.endsWith('.svg')) {
				return null
			}

			console.log('aaaaa', id)

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
			html = html.replace(/<h2>(.*)<\/h2>/g, (match, m) => {
				const slug = m.toLowerCase().replace(/ /g, '-')
				toc.push({ slug, title: m, type: 'h2' })
				return match.replace(/<h2>/, `<h2 id="${slug}">`)
			})
			html = html.replace(/<h3>(.*)<\/h3>/g, (match, m) => {
				const slug = m.toLowerCase().replace(/ /g, '-')
				toc.push({ slug, title: m, type: 'h3' })
				return match.replace(/<h3>/, `<h3 id="${slug}">`)
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

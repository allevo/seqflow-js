import { defineConfig } from "vite";
import MarkdownIt from 'markdown-it'
import pluginPurgeCss from "@mojojoejo/vite-plugin-purgecss";

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
		// loadTSDPlugin(),
	],
	build: {
		outDir: "../dist",
	},
});

function loadTSDPlugin() {
	return {
		name: 'seqflow-tsd',
		enforce: 'pre' as const,

		async transform (code, id) {
			// If it's not a .ts file, we can just skip this
			console.log('id', id)
			if (!/seqflow-js\/dist\/index.d.ts/.test(id)) {
				return null
			}

			console.log('AAAAAAAAAA', id, code)

			const app = await td.Application.bootstrapWithPlugins({}, [
				new td.TypeDocReader(),
			]);
			const project = await app.convert();
			console.log(project)
			if (!project) throw new Error('Project not found')
			app.validate(project);
			console.log('validated')

			const ser = this.serializer.projectToObject(project, process.cwd());



			return {
				code: code.replace(/export default /, 'export default function ')
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

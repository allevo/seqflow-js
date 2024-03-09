
import { JSDOM, VirtualConsole } from "jsdom"
import path from 'node:path'
import fs from 'node:fs/promises'
import http from 'node:http'
import { minify } from 'html-minifier'

const virtualConsole = new VirtualConsole();
virtualConsole.on("error", (...args) => { console.log('console.log', args) });
virtualConsole.on("warn", (...args) => { console.log('console.log', args) });
virtualConsole.on("info", (...args) => { console.log('console.log', args) });
virtualConsole.on("dir", (...args) => { console.log('console.log', args) });

const server = http.createServer(async (req, res) => {
    const filePath = `${path.join(path.dirname(import.meta.url), '..', 'dist')}${req.url}`.split('file:')[1]
    const b = await fs.readFile(filePath, 'utf-8')
    res.end(b);
})
await new Promise((res) => server.listen(() => res(void 0)))
const port = (server.address() as any).port
const baseUrl = `http://localhost:${port}`

const htmlPath = `${path.join(path.dirname(import.meta.url), '..', 'dist')}/index.html`.split('file:')[1]
const html = await fs.readFile(htmlPath, 'utf-8')
const htmlWithoutTypeModule = html.replace(/type="module"/g, 'defer')

const pages = [
    {
        path: '/',
        filename: 'index.html'
    },
    {
        path: '/doc',
        filename: 'doc.html'
    },
    {
        path: '/why',
        filename: 'why.html'
    }
]

const output: any[] = []
for (const page of pages) {
    const dom = new JSDOM(htmlWithoutTypeModule, {
        resources: "usable",
        runScripts: "dangerously",
        url: `${baseUrl}${page.path}`,
    });
    await new Promise((resolve) => setTimeout(resolve, 1_000))

    const resultHtml = dom.serialize()
    const resultHTMWithoutScripts = resultHtml
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>/gi, '')
        .replace('<link rel="custom">', '<script type="module" defer src="/assets/bootstrap.bundle.min.js"></script>')

    const result = minify(resultHTMWithoutScripts, {
        html5: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
    });

    output.push({
        html: result,
        filename: page.filename
    })
}

server.close()

await fs.mkdir('printed/assets', { recursive: true })
await fs.mkdir('printed/images', { recursive: true })
const assets = await fs.readdir('dist/assets')
for (const asset of assets) {
    if (asset === '.' || asset === '..') {
        continue
    }
    await fs.copyFile(`dist/assets/${asset}`, `printed/assets/${asset}`)
}
const images = await fs.readdir('dist/images')
for (const image of images) {
    if (image === '.' || image === '..') {
        continue
    }
    await fs.copyFile(`dist/images/${image}`, `printed/images/${image}`)
}

for (const page of output) {
    await fs.writeFile(`printed/${page.filename}`, page.html)
}



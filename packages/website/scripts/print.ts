
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
]

const output: any[] = []
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
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>/gi, '')
        .replace('<link rel="custom">', `
<script type="module" defer src="/assets/bootstrap.bundle.min.js"></script>
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

    output.push({
        html: result,
        filename: page.filename
    })
}

server.close()

await fs.mkdir('printed/assets', { recursive: true })
await fs.mkdir('printed/images', { recursive: true })
await fs.mkdir('printed/getting-started', { recursive: true })
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

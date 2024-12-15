/// <reference types="node" />
import Fastify from 'fastify';
import fs from 'node:fs';
import { join } from 'node:path';
import * as vite from 'vite';

const firstParameter = process.argv[2];
const projectCwd = process.cwd();

console.log('firstParameter', firstParameter);
console.log('projectCwd', projectCwd);

const app = Fastify({
    logger: true
});

app.get('/', async (request, reply) => {
    const content = fs.readFileSync(`/Users/allevo/repos/seqflow-js/packages/component-book/src/index.html`, 'utf8');
    reply.type('text/html').send(content);
});

const thisParentDirA = import.meta.url.split('/').slice(3, -1).join('/');
app.get('/components.js', async (request, reply) => {
    const a = await vite.build({
        root: projectCwd,
        build: {
            emptyOutDir: false,
            cssCodeSplit: false,
            copyPublicDir: false,
            outDir: '/' + join(thisParentDirA, "output"),
            lib: {
                entry: firstParameter,
                formats: ['es'],
                name: 'index',
                fileName: 'index.all',
            },
            rollupOptions: {
                external: () => false,
            }
        },
        plugins: [],
    })

    const path = '/' + join(thisParentDirA, "output") + '/book.js';

    const content = fs.readFileSync(path, 'utf8');
    reply.type('application/javascript').send(content);
});
app.get('/main.js', async (request, reply) => {
    const content = fs.readFileSync(`/Users/allevo/repos/seqflow-js/packages/component-book/dist/index.all.js`, 'utf8');
    reply.type('application/javascript').send(content);
});

app.listen({
    port: 3000
});
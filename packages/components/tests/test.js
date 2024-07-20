/*
import { spawn, spawnSync } from 'node:child_process';
import waitOn from 'wait-on';

const storybookProcess = spawn('pnpm', ['run', 'storybook'], { stdio: 'inherit' })

await waitOn({
    resources: ['http://localhost:6006'],
    timeout: 10_000
})

spawnSync('pnpm', ['test:storybook'], { stdio: 'inherit' })

storybookProcess.kill('SIGINT')
*/

console.log('SKIPPED')
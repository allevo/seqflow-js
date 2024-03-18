import { readFile, writeFile } from 'node:fs/promises'
import { execa } from 'execa'

async function changeWorkspaceDependencies(packageName, newVersion) {
    const packageJsonPath = `packages/${packageName}/package.json`

    console.log(`Updating "${packageName}"...`)

    const packageJSON = JSON.parse(await readFile(packageJsonPath, 'utf-8'))
    if (!packageJSON.dependencies) {
        console.log(`No dependencies in ${packageJsonPath}`)
        return
    }
    if (!packageJSON.dependencies['seqflow-js']) {
        console.log(`No "seqflow-js" dependency in ${packageJsonPath}`)
        return
    }

    packageJSON.dependencies['seqflow-js'] = newVersion

    await writeFile(packageJsonPath, JSON.stringify(packageJSON, null, 2))

    console.log(`Updated "${packageName}"`)
}

async function main(newVersion) {
    if (!newVersion) {
        throw new Error('No version provided')
    }
    newVersion = newVersion.replace(/^v/, '')

    const packagesToPublish = [
        'seqflow-js',
        'create-seqflow',
    ]

    console.log('BEFORE', await execa('git', ['status']))

    for (const packageName of packagesToPublish) {
        await changeWorkspaceDependencies(packageName, newVersion)
    }

    console.log('AFTER', await execa('git', ['status']))
    await execa('git', ['commit', '-a', '-m', `"Bump to v${newVersion}"`])
    await execa('git', ['tag', `v${newVersion}`])

    for (const packageName of packagesToPublish) {
        await execa('pnpm', ['publish', '--dry-run'], {
            cwd: `packages/${packageName}`,
            stdio: 'inherit'
        })
    }

    for (const packageName of packagesToPublish) {
        await changeWorkspaceDependencies(packageName, 'workspace:*')
    }

    await execa('git', ['commit', '-a', '-m', `"After v${newVersion}"`])
}

await main('0.0.1')

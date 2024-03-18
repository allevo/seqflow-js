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

    console.log('Bumping versions to', newVersion)

    const packagesToPublish = [
        'seqflow-js',
        'create-seqflow',
    ]

    for (const packageName of packagesToPublish) {
        await changeWorkspaceDependencies(packageName, newVersion)
    }

    console.log('Committing and tagging...', newVersion)
    await execa('git', ['commit', '-a', '-m', `"Bump to v${newVersion}"`])
    await execa('git', ['tag', `v${newVersion}`])

    console.log('Publishing...')
    for (const packageName of packagesToPublish) {
        await execa('pnpm', ['publish', '--dry-run'], {
            cwd: `packages/${packageName}`,
            stdio: 'inherit'
        })
    }
    console.log('Published!')

    console.log('Change again to "workspace:*"...')
    for (const packageName of packagesToPublish) {
        await changeWorkspaceDependencies(packageName, 'workspace:*')
    }
    await execa('git', ['commit', '-a', '-m', `"After v${newVersion}"`])
    console.log('Done!')
}

const newVersion = process.argv[2]
await main(newVersion)

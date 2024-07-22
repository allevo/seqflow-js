import ts from 'typescript'
import fs from 'node:fs'
import MagicString from "magic-string";
import type { SBScalarType, StrictArgTypes, StrictInputType } from '@storybook/types'

import { type Plugin, createFilter } from "vite";

function tsSymbolToStrictInputType(name: string, symbol: ts.Symbol, checker: ts.TypeChecker): StrictInputType {
    if (symbol.valueDeclaration?.kind  !== ts.SyntaxKind.PropertySignature) {
        throw new Error(`Expected a PropertySignature, got ${symbol.valueDeclaration?.kind}`)
    }
    const valueDeclaration = symbol.valueDeclaration as ts.PropertySignature & { jsDoc: ts.JSDoc[] } | undefined

    if (!valueDeclaration) {
        throw new Error(`valueDeclaration is undefined`)
    }

    const isOptional = !!valueDeclaration.questionToken
    const description = valueDeclaration.jsDoc?.map(s => s.comment).join('\n')

    const ff = checker.getTypeOfSymbolAtLocation(
        symbol,
        symbol.valueDeclaration
    )
    const intrinsicName = (ff as any).intrinsicName
    if (["string", "number", "boolean"].includes(intrinsicName)) {
        return {
            name,
            description,
            type: {
                name: intrinsicName,
                required: !isOptional,
            }
        }
    } else {

        const sub = symbol.valueDeclaration as ts.PropertySignature | undefined
        if (!sub) {
            throw new Error(`Expected a PropertySignature, got ${symbol.valueDeclaration?.kind}`)
        }
        if (!sub.type) {
            throw new Error(`Expected a type`)
        }
        if (sub.type.kind == ts.SyntaxKind.UnionType) {
            const s = sub.type as ts.UnionTypeNode

            const kinds = Array.from(new Set(s.types.map(t => {
                if (t.kind !== ts.SyntaxKind.LiteralType) {
                    throw new Error(`Expected a LiteralType`)
                }
                const tt = t as ts.LiteralTypeNode
                const l = tt.literal as ts.LiteralLikeNode

                return l.kind
            })))
            if (kinds.length !== 1) {
                console.log('Unmanaged multiple kinds.', { kinds })
                throw new Error('Expect only one kind')
            }
            let typeName: SBScalarType['name']
            switch (kinds[0]) {
                case ts.SyntaxKind.NumericLiteral:
                    typeName = 'number'
                    break
                case ts.SyntaxKind.StringLiteral:
                    typeName = 'string'
                    break
                default:
                    console.log('Unexpected kind', {name, kinds})
                    throw new Error('Unexpected kind. Only String and Number are supported')
            }

            const options = s.types.map(t => {
                if (t.kind !== ts.SyntaxKind.LiteralType) {
                    throw new Error(`Expected a LiteralType`)
                }
                const tt = t as ts.LiteralTypeNode
                const l = tt.literal as ts.LiteralLikeNode

                if (typeName === 'number') {
                    return parseInt(l.text, 10)
                }
                return l.text
            })

            return {
                name,
                description,
                type: {
                    name: typeName,
                    required: !isOptional,
                },
                control: {
                    type: 'select',
                },
                options,
            }
        } /* else if (sub.type.kind == ts.SyntaxKind.IndexedAccessType) {
            
            const type = sub.type as ts.IndexedAccessTypeNode

            console.log('objectType', {...type.objectType, parent: undefined})
            console.log('indexType', {...type.indexType, parent: undefined})

        } */

        throw new Error(`Unsupported type: ${sub.type.kind}`)
    }

    throw new Error(`Unsupported intrinsicName ${intrinsicName}`)
}

export function foo(filePath: string, tsConfig: any) {
    const program = ts.createProgram([filePath], tsConfig)

    const out = program.getSourceFile(filePath)

    if (!out) {
        console.log(`No source file for ${filePath}`)
        return
    }

    const checker = program.getTypeChecker();
    const moduleSymbol = checker.getSymbolAtLocation(out)
    if (!moduleSymbol) {
        console.log(`No module symbol for ${filePath}`)
        return
    }
    const allComponents = checker.getExportsOfModule(moduleSymbol);

    const components = allComponents.filter(c => c.valueDeclaration?.kind === ts.SyntaxKind.FunctionDeclaration)
    if (components.length === 0) {
        console.log(`No component for ${filePath}`)
        return
    }

    const output: {
        componentName: string,
        fields: Record<string, unknown>
    }[] = []
    for (const component of components) {

        let componentName = component.escapedName
        if (componentName === 'default') {
            if (component.valueDeclaration && 'localSymbol' in component.valueDeclaration) {
                const ls = component.valueDeclaration.localSymbol as { escapedName: ts.__String }
                componentName = ls.escapedName
            } else {
                console.log('Export default is shaped differently')
                console.log(component.valueDeclaration)
                throw new Error('WHAAATT??')
            }
        }

        if (typeof componentName !== 'string') {
            console.log(componentName)
            throw new Error('Component Name is not a string')
        }

        const propInterface = allComponents.find(c => {
            return typeof c.escapedName === 'string' &&
                /prop/i.test(c.escapedName) &&
                new RegExp(componentName, 'i').test(c.escapedName)
        })

        if (!propInterface) {
            console.log(`No prop interface for ${filePath}`, { componentName })
            continue
        }

        if (!propInterface.members) {
            console.log(`No prop interface members for ${filePath}`, {componentName})
            continue
        }

        const fields: StrictArgTypes = {}
        for (const [name, symbol] of propInterface.members) {
            if (typeof name !== 'string') {
                continue
            }

            fields[name] = tsSymbolToStrictInputType(name, symbol, checker)
        }

        output.push({
            fields,
            componentName,
        })
    }

    return output
}

function builder(tsConfigPath: string) {
    const tsConfig = ts.readConfigFile(tsConfigPath, p => fs.readFileSync(p, 'utf8'))

    return {
        generateStorybookMetadataFor(filePath: string, compiledSource: string) {

            const components = foo(filePath, tsConfig.config)
            if (!components) {
                console.log('No data found')
                return
            }
            
            const s = new MagicString(compiledSource);
            for (const { componentName, fields } of components) {
                s.append(`
${componentName}.__storybook = {
    props: ${JSON.stringify(fields)}
}`)
                }

            return {
                code: s.toString(),
                map: s.generateMap()
            }
        }
    }
}

export function addStorybookMetaPlugin(config: unknown): Plugin {
	let filter: (id: string) => boolean;
	let b: ReturnType<typeof builder> | null = null;

	return {
		name: "vite:react-docgen-typescript",
		async configResolved() {
			b = builder('./tsconfig.json')
			filter = createFilter(
				["**/**.tsx"],
				["**/**.stories.tsx"],
			);
		},
		async transform(src, id, a) {
			if (!filter(id)) {
				return;
			}

			return b?.generateStorybookMetadataFor(id, src)
		},
	};
}

import ts from 'typescript'
import fs from 'node:fs'
import MagicString from "magic-string";
import type { StrictArgTypes, StrictInputType } from '@storybook/types'

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
        if (sub.type.kind !== ts.SyntaxKind.UnionType) {
            throw new Error(`Expected a UnionType`)
        }
        const s = sub.type as ts.UnionTypeNode
        const options = s.types.map(t => {
            if (t.kind !== ts.SyntaxKind.LiteralType) {
                throw new Error(`Expected a LiteralType`)
            }
            const tt = t as ts.LiteralTypeNode
            const l = tt.literal as ts.LiteralLikeNode
            return l.text
        })

        return {
            name,
            description,
            type: {
                name: 'string',
                required: !isOptional,
            },
            control: {
                type: 'select',
            },
            options,
        }
    }

    throw new Error(`Unsupported intrinsicName ${intrinsicName}`)
}


function builder(tsConfigPath: string) {
    const tsConfig = ts.readConfigFile(tsConfigPath, p => fs.readFileSync(p, 'utf8'))

    return {
        generateStorybookMetadataFor(filePath: string, compiledSource: string) {
            const program = ts.createProgram([filePath], tsConfig.config)

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
            const components = checker.getExportsOfModule(moduleSymbol);
            
            const component = components.find(c => c.valueDeclaration?.kind === ts.SyntaxKind.FunctionDeclaration)
            if (!component) {
                console.log(`No component for ${filePath}`)
                return
            }
            const componentName = component.escapedName

            const propInterface = components.find(c => typeof c.escapedName === 'string' && /prop/i.test(c.escapedName))

            if (!propInterface) {
                console.log(`No prop interface for ${filePath}`)
                return
            }

            if (!propInterface.members) {
                console.log(`No prop interface members for ${filePath}`)
                return
            }

            const fields: StrictArgTypes = {}
            for (const [name, symbol] of propInterface.members) {
                if (typeof name !== 'string') {
                    continue
                }

                fields[name] = tsSymbolToStrictInputType(name, symbol, checker)
            }

            const s = new MagicString(compiledSource);

            s.append(`
${componentName}.__storybook = {
    props: ${JSON.stringify(fields)}
}`)

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

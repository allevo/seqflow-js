import ts, { LiteralTypeNode, TypeNode } from 'typescript'
import fs from 'node:fs'
import MagicString from "magic-string";
import type { SBType, StrictArgTypes, StrictInputType } from '@storybook/types'

import { type Plugin, createFilter } from "vite";

function extrapolateSBTypeFromUnionType(type: TypeNode): SBType {
    if (type.kind !== ts.SyntaxKind.UnionType) {
        throw new Error(`Expected a UnionType, got ${type.kind}`)
    }
    const tt = type as ts.UnionTypeNode

    const ret: SBType = {
        name: 'union',
        value: [],
        required: true,
    }
    for (const t of tt.types) {
        switch (t.kind) {
            case ts.SyntaxKind.StringKeyword:
                ret.value.push({
                    name: 'string'
                })
                break
            case ts.SyntaxKind.LiteralType:
                const tt = t as ts.LiteralTypeNode
                const l = tt.literal as ts.LiteralLikeNode

                if (l.kind === ts.SyntaxKind.NumericLiteral) {
                    ret.value.push({
                        name: 'number'
                    })
                } else if (l.kind === ts.SyntaxKind.StringLiteral) {
                    ret.value.push({
                        name: 'string'
                    })
                } else if (l.kind === ts.SyntaxKind.TrueKeyword || l.kind === ts.SyntaxKind.FalseKeyword) {
                    ret.value.push({
                        name: 'boolean'
                    })
                } else {
                    throw new Error(`Unsupported literal kind ${l.kind}`)
                }
                break
            case ts.SyntaxKind.NumberKeyword:
                ret.value.push({
                    name: 'number'
                })
                break
            case ts.SyntaxKind.BooleanKeyword:
                ret.value.push({
                    name: 'boolean'
                })
                break
            case ts.SyntaxKind.TypeReference: {
                const tr = t as ts.TypeReferenceNode
                if (tr.typeName.kind !== ts.SyntaxKind.QualifiedName) {
                    throw new Error(`Expected a QualifiedName, got ${tr.typeName.kind}`)
                }
                ret.value.push({
                    name: 'other',
                    value: tr.typeName.getText(),
                })
                break
            }
            default:
                console.log(t)
                throw new Error(`Unsupported type ${t.kind}`)
        }
    }

    const uniqueValues = Array.from(new Set(ret.value.map(v => v.name)))
    if (uniqueValues.length === 1) {
        if (uniqueValues[0] === 'string' || uniqueValues[0] === 'number' || uniqueValues[0] === 'boolean') {
            return {
                name: uniqueValues[0],
                required: true,
            }
        }
        throw new Error('Not yet implemented')
    }

    return ret
}

function extrapolateSBControlFromUnionType(type: TypeNode): StrictInputType['control'] {
    if (type.kind !== ts.SyntaxKind.UnionType) {
        throw new Error(`Expected a UnionType, got ${type.kind}`)
    }
    const tt = type as ts.UnionTypeNode

    const kinds = tt.types.map(t => t.kind)
    if (kinds.includes(ts.SyntaxKind.LiteralType)) {
        const literalKinds = Array.from(new Set(tt.types.map(t => (t as LiteralTypeNode).literal.kind)))
        literalKinds.sort()
        if (literalKinds[0] === ts.SyntaxKind.TrueKeyword && literalKinds[1] === ts.SyntaxKind.FalseKeyword) {
            return {
                type: 'boolean',
            }
        }
        return {
            type: 'select',
        }
    }
    return undefined
}

function extrapolateSBOptionsFromUnionType(type: TypeNode): StrictInputType['options'] {
    if (type.kind !== ts.SyntaxKind.UnionType) {
        throw new Error(`Expected a UnionType, got ${type.kind}`)
    }
    const tt = type as ts.UnionTypeNode

    const ret: string[] = []
    for (const t of tt.types) {
        switch (t.kind) {
            case ts.SyntaxKind.LiteralType:
                const tt = t as ts.LiteralTypeNode
                const l = tt.literal as ts.LiteralLikeNode

                if (l.kind === ts.SyntaxKind.NumericLiteral) {
                    ret.push(l.getText().replace(/['"]/g, ''))
                } else if (l.kind === ts.SyntaxKind.StringLiteral) {
                    ret.push(l.getText().replace(/['"]/g, ''))
                } else if (l.kind === ts.SyntaxKind.TrueKeyword || l.kind === ts.SyntaxKind.FalseKeyword) {
                    continue;
                } else {
                    throw new Error(`Unsupported literal kind ${l.kind}`)
                }
                break
            case ts.SyntaxKind.StringKeyword:
            case ts.SyntaxKind.NumberKeyword:
            case ts.SyntaxKind.BooleanKeyword:
                continue;
            case ts.SyntaxKind.TypeReference:
                continue;
            default:
                throw new Error(`Unsupported type ${t.kind}`)
        }
    }

    if (ret.length === 0) {
        return undefined
    }

    return ret
}

function tsSymbolToStrictInputType(name: string, symbol: ts.Symbol, sourceFile: ts.SourceFile): StrictInputType | null {
    if (symbol.valueDeclaration?.kind  !== ts.SyntaxKind.PropertySignature) {
        throw new Error(`Expected a PropertySignature, got ${symbol.valueDeclaration?.kind}`)
    }
    const valueDeclaration = symbol.valueDeclaration as ts.PropertySignature & { jsDoc: ts.JSDoc[] } | undefined

    if (!valueDeclaration) {
        throw new Error('valueDeclaration is undefined')
    }

    const isOptional = !!valueDeclaration.questionToken
    const description = valueDeclaration.jsDoc?.map(s => s.comment).join('\n')

    if (valueDeclaration.name.kind !== ts.SyntaxKind.Identifier) {
        throw new Error(`Expected a Identifier, got ${valueDeclaration.name.kind}`)
    }
    const propertyName = valueDeclaration.name.escapedText
    if (propertyName !== name) {
        console.log('Expected', name, 'got', propertyName)
        throw new Error('Unexpected property name')
    }

    if (!valueDeclaration.type) {
        throw new Error('Expected a type')
    }
    let sbType: SBType
    let control: StrictInputType['control']
    let options: StrictInputType['options']
    switch (valueDeclaration.type.kind) {
        case ts.SyntaxKind.UnionType:
            sbType = extrapolateSBTypeFromUnionType(valueDeclaration.type)
            control = extrapolateSBControlFromUnionType(valueDeclaration.type)
            options = extrapolateSBOptionsFromUnionType(valueDeclaration.type)
            break
        case ts.SyntaxKind.StringKeyword:
            sbType = {
                name: 'string',
                required: !isOptional,
            }
            control = { type: 'text' }
            options = undefined
            break
        case ts.SyntaxKind.BooleanKeyword:
            sbType = {
                name: 'boolean',
                required: !isOptional,
            }
            control = { type: 'boolean' }
            options = undefined
            break
        case ts.SyntaxKind.NumberKeyword:
            sbType = {
                name: 'number',
                required: !isOptional,
            }
            control = { type: 'number' }
            options = undefined
            break
        case ts.SyntaxKind.IndexedAccessType: {
            const t = valueDeclaration.type as ts.IndexedAccessTypeNode
            const objectTypeName = t.objectType.getText()
            const propertyName = t.indexType.getText().replace(/['"]/g, '')
            
            const a = sourceFile.statements.filter(s => {
                if (s.kind !== ts.SyntaxKind.InterfaceDeclaration) {
                    return false
                }
                const i = s as ts.InterfaceDeclaration
                return i.name.getText() === objectTypeName
            })
            if (a.length === 0) {
                throw new Error(`No interface found for ${objectTypeName}`)
            }
            if (a.length > 1) {
                throw new Error(`Multiple interfaces found for ${objectTypeName}`)
            }

            const objectType = a[0] as ts.InterfaceDeclaration

            const members = objectType.members.filter(m => {
                if (m.kind !== ts.SyntaxKind.PropertySignature) {
                    return false
                }
                
                const p = m as ts.PropertySignature
                return p.name.getText() === propertyName
            })
            if (members.length === 0) {
                throw new Error(`No property found for ${propertyName}`)
            }
            if (members.length > 1) {
                throw new Error(`Multiple properties found for ${propertyName}`)
            }
            const member = members[0] as ts.PropertySignature & { symbol: ts.Symbol }

            return tsSymbolToStrictInputType(propertyName, member.symbol, sourceFile)
        }
        case ts.SyntaxKind.FunctionType: {
            return null
        }
        default:
            console.log(valueDeclaration.type)
            throw new Error(`Unsupported type ${valueDeclaration.type.kind}`)
    }

    return {
        name,
        description,
        type: {
            ...sbType,
            required: !isOptional,
        },
        control,
        options,
    }
}

export function getFileComponents(filePath: string, tsConfig: any) {
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
    if (moduleSymbol.valueDeclaration?.kind !== ts.SyntaxKind.SourceFile) {
        console.log(`Module symbol is not a SourceFile for ${filePath}`)
        return
    }
    const allComponents = checker.getExportsOfModule(moduleSymbol);

    const sourceFile = moduleSymbol.valueDeclaration as ts.SourceFile

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
                new RegExp(componentName, 'i').test(c.escapedName) &&
                c.members
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

            const field = tsSymbolToStrictInputType(name, symbol, sourceFile)
            if (!field) {
                continue
            }
            fields[name] = field
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

            try {
                const components = getFileComponents(filePath, tsConfig.config)
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
            } catch (e) {
                console.error('Cannot generate storybook metadata for', filePath)
                console.error(e)
                return
            }
        }
    }
}

export function addStorybookMetaPlugin(config: unknown): Plugin {
	let filter: (id: string) => boolean;
	let b: ReturnType<typeof builder> | null = null;

	return {
		name: "vite:seqflow-docgen-typescript",
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

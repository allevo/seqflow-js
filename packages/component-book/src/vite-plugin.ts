import ts, { EmitHint, LiteralTypeNode, SyntaxKind, TypeNode, VariableDeclaration } from 'typescript'
import fs from 'node:fs'
import MagicString from "magic-string";
import { Biome, Distribution } from "@biomejs/js-api";

import { type Plugin, createFilter } from "vite";
import { ComponentProperty, ComponentPropertyType, ComponentPropertyUnionType } from './domains/book';

function extrapolateSBTypeFromUnionType(type: TypeNode): ComponentPropertyType {
    if (type.kind !== ts.SyntaxKind.UnionType) {
        throw new Error(`Expected a UnionType, got ${type.kind}`)
    }
    const tt = type as ts.UnionTypeNode

    const ret: ComponentPropertyUnionType = {
        t: 'union',
        type: []
    };
    for (const t of tt.types) {
        switch (t.kind) {
            case ts.SyntaxKind.StringKeyword:
                ret.type.push({
                    t: 'basic',
                    type: 'string',
                })
                break
            case ts.SyntaxKind.LiteralType:
                const tt = t as ts.LiteralTypeNode
                const l = tt.literal as ts.LiteralLikeNode

                if (l.kind === ts.SyntaxKind.TrueKeyword) {
                    ret.type.push({
                        t: 'literal',
                        type: 'true',
                    })
                    break
                }
                if (l.kind === ts.SyntaxKind.FalseKeyword) {
                    ret.type.push({
                        t: 'literal',
                        type: 'false',
                    })
                    break
                }

                const type = l.text
                if (typeof type !== 'string') {
                    console.log(t)
                    throw new Error(`Unsupported literal type ${type}`)
                }
                ret.type.push({
                    t: 'literal',
                    type: l.text,
                })
                break
            case ts.SyntaxKind.NumberKeyword:
                ret.type.push({
                    t: 'basic',
                    type: 'string',
                })
                break
            case ts.SyntaxKind.BooleanKeyword:
                ret.type.push({
                    t: 'basic',
                    type: 'boolean',
                })
                break
            case ts.SyntaxKind.TypeReference: {
                const tr = t as ts.TypeReferenceNode
                if (tr.typeName.kind !== ts.SyntaxKind.QualifiedName) {
                    throw new Error(`Expected a QualifiedName, got ${tr.typeName.kind}`)
                }
                ret.type.push({
                    t: 'unknown',
                    type: tr.typeName.getText(),
                })
                break
            }
            default:
                console.log(t)
                throw new Error(`Unsupported type ${t.kind}`)
        }
    }

    return ret
}

function tsSymbolToStrictInputType(name: string, symbol: ts.Symbol, sourceFile: ts.SourceFile): ComponentProperty | null {
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
    let sbType: ComponentPropertyType
    switch (valueDeclaration.type.kind) {
        case ts.SyntaxKind.UnionType:
            sbType = extrapolateSBTypeFromUnionType(valueDeclaration.type)
            break
        case ts.SyntaxKind.StringKeyword:
            sbType = { t: 'basic', type: 'string' }
            break
        case ts.SyntaxKind.BooleanKeyword:
            sbType = { t: 'basic', type: 'boolean' }
            break
        case ts.SyntaxKind.NumberKeyword:
            sbType = { t: 'basic', type: 'number' }
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
            return {
                name,
                description,
                required: !isOptional,
                type: {
                    t: 'unknown',
                    type: 'Function',
                },
            }
        }
        default:
            console.log(valueDeclaration.type)
            throw new Error(`Unsupported type ${valueDeclaration.type.kind}`)
    }

    return {
        name,
        description,
        required: !isOptional,
        type: sbType,
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
        name: string,
        description?: string,
        fields: Record<string, ComponentProperty>
    }[] = []
    for (const component of components) {

        let description = component.declarations?.flatMap(declaration => {
            const d = declaration as unknown as { jsDoc?: ts.JSDoc[] }
            return d.jsDoc?.map(jsDoc => jsDoc.comment)
        }).join('\n')

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
            output.push({
                name: componentName,
                description,
                fields: {},
            })
            console.log(`No prop interface for ${filePath}`, { componentName })
            continue
        }

        if (!propInterface.members) {
            output.push({
                name: componentName,
                description,
                fields: {},
            })
            console.log(`No prop interface members for ${filePath}`, {componentName})
            continue
        }

        const fields: Record<string, ComponentProperty> = {}
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
            name: componentName,
            description,
            fields,
        })
    }

    return output
}

async function getStories(filePath: string, tsConfig: any, compiledSource: string) {
    if (/_renderFunctions/.test(compiledSource)) {
        console.log('Already has render functions')
        return
    }

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

    const s = new MagicString(compiledSource);
    for (let [key, value] of moduleSymbol.exports!.entries()) {
        if (!value.valueDeclaration) {
            continue
        }
        let decl = value.valueDeclaration as VariableDeclaration
        if (decl.kind !== SyntaxKind.VariableDeclaration) {
            continue
        }
        if (!decl.initializer) {
            continue
        }
        let init = (decl.initializer as { symbol?: ts.Symbol})
        if (!init.symbol) {
            continue
        }
        let k = init.symbol.members
        if (!k) {
            continue
        }

        let stories = k.get('stories' as ts.__String)?.valueDeclaration as ts.PropertyAssignment | undefined
        if (!stories) {
            continue
        }

        let storyArray = stories.initializer as ts.ArrayLiteralExpression

        s.append(`${key}.originalRenderFunctions = [];\n`);
        for (let el of storyArray.elements) {
            if (el.kind !== SyntaxKind.ObjectLiteralExpression) {
                s.append(`${key}.originalRenderFunctions.push(\`\nel.kind !== SyntaxKind.ObjectLiteralExpression\n\`)\n`);
                continue
            }
            const e = el as ts.ObjectLiteralExpression

            let symbol = (e as ({ symbol?: ts.Symbol })).symbol
            if (!(symbol?.valueDeclaration)) {
                s.append(`${key}.originalRenderFunctions.push(\`\n!symbol?.valueDeclaration\n\`)\n`);
                continue
            }
            let symbol2 = (symbol.valueDeclaration as ({ symbol?: ts.Symbol })).symbol
            if (!symbol2) {
                s.append(`${key}.originalRenderFunctions.push(\`\n!symbol2\n\`)\n`);
                continue
            }
            let renderFunction = symbol2.members?.get('renderFunction' as ts.__String)
            if (!renderFunction) {
                s.append(`${key}.originalRenderFunctions.push(\`\n!renderFunction\n\`)\n`);
                continue
            }
            let functionValueDeclaration = renderFunction.valueDeclaration as ts.PropertyAssignment | undefined
            if (!functionValueDeclaration) {
                s.append(`${key}.originalRenderFunctions.push(\`\n!functionValueDeclaration\n\`)\n`);
                continue
            }

            let functionInitializer = functionValueDeclaration.initializer as ts.ArrowFunction

            let printer = ts.createPrinter({})
            let printedFunction = printer.printNode(EmitHint.Unspecified, functionInitializer.body, out)

            let functionBodyArr = printedFunction.split('\n')
                .filter((l: string) => !(/\/\//.test(l) && /\@ts/.test(l)))

            functionBodyArr.pop()
            functionBodyArr.shift()

            let functionBody = functionBodyArr
                .join('\n')
                .trim()

            const biome = await Biome.create({
                distribution: Distribution.NODE,
            });

            const formatted = biome.formatContent(functionBody, {
                filePath: filePath,
            });

            s.append(`${key}.originalRenderFunctions.push(\`\n${formatted.content}\n\`)\n`);
        }
    }

    let a = s.toString()

    return {
        code: a,
        map: s.generateMap()
    }
}

function createBuilder(tsConfigPath: string) {
    const tsConfig = ts.readConfigFile(tsConfigPath, p => fs.readFileSync(p, 'utf8'))

    return {
        generateComponentMetadataFor(filePath: string, compiledSource: string) {
            try {
                const components = getFileComponents(filePath, tsConfig.config)
                if (!components) {
                    console.log('No data found')
                    return
                }
                
                const s = new MagicString(compiledSource);
                for (const { name, fields } of components) {
                    s.append(`${name}.__ts = {
    props: ${JSON.stringify(fields)},
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
        },

        async generateStoriesFor(filePath: string, compiledSource: string) {
            const stories = await getStories(filePath, tsConfig.config, compiledSource)
            return stories
        }
    }
}

export function addStorybookMetaPlugin(config: unknown): Plugin {
	let filter: (id: string) => boolean;
	let builder: ReturnType<typeof createBuilder> | null = null;

	return {
		name: "vite:seqflow-docgen-typescript",
		async configResolved() {
			builder = createBuilder('./tsconfig.json')
			filter = createFilter(
				["**/**.tsx", "**/**.stories.tsx"],
			);
		},

		async transform(src, id, a) {
			if (!filter(id)) {
				return;
			}

            if (/stories/.test(id)) {
                return builder?.generateStoriesFor(id, src)
            } else {
                return builder?.generateComponentMetadataFor(id, src)
            }
		},
	};
}

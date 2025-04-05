
export class ComponentBook {
    public pages: ComponentPage[] = [];

    registerComponentPage(page: ComponentPage) {
        this.pages.push(page);
    }

    getComponentPageBySlug(slug: string): ComponentPage | undefined {
        return this.pages.find(page => page.component.slug === slug);
    }
}

export type ComponentPropertyUnionType = {
    t: 'union', 
    type: Array<ComponentPropertyBasicType>,
};
export type ComponentPropertyBasicType = {
    t: 'basic',
    type: 'string' | 'number' | 'boolean',
} | {
    t: 'literal',
    type: string,
} | {
    t: 'unknown',
    type: string,
};

export type ComponentPropertyType = |
    ComponentPropertyBasicType |
    ComponentPropertyUnionType

export type ComponentProperty = {
    name: string,
    description?: string,
    type: ComponentPropertyType,
    required: boolean,
}

export type ComponentPage = {
	component: {
		slug: string,
		name: string,
		props: Record<string, ComponentProperty>,
	},
	stories: {
        slug: string,
        name: string,
        description?: string,
        renderFunction: (div: HTMLDivElement) => Promise<void>,
    }[]
};

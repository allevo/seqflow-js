
export class ComponentBook {
    public pages: ComponentPage[] = [];

    registerComponentPage(page: ComponentPage) {
        console.log('--', page)
        this.pages.push(page);
    }
}


export type ComponentPage = {
	component: {
		slug: string,
		name: string,
		ts: any,
	},
	stories: {
        slug: string,
        name: string,
        renderFunction: (div: HTMLDivElement) => Promise<void>,
    }[]
};

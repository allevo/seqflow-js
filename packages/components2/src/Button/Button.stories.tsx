

import { ComponentPage } from "@seqflow/document-component-lib";
import { Button } from ".";
import { start } from "@seqflow/seqflow";

export const ButtonDoc: ComponentPage = {
	component: {
		slug: 'button',
		name: 'Button',
		ts: (Button as any).__ts,
	},
	stories: [
		{
			slug: 'base',
			name: 'Base',
			renderFunction: async (div: HTMLDivElement) => {
				// @ts-ignore
				start(div, Button, {}, {});
			},
		},
		{
			slug: 'disables',
			name: 'Disabled button',
			renderFunction: async (div: HTMLDivElement) => {
				start(div, Button, {
					disabled: true,
					// @ts-ignore
				}, {});
			},
		}
	]
};

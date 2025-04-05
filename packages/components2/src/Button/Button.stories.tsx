

import { ComponentPage } from "../../../component-book/dist";
import { Button } from ".";
import { Contexts, start } from "@seqflow/seqflow";

export const ButtonDoc: ComponentPage = {
	component: {
		slug: 'button',
		name: 'Button',
		...((Button as any).__ts || {})
	},
	stories: [
		{
			slug: 'base',
			name: 'Base',
			description: 'Base button',
			renderFunction: async (div: HTMLDivElement) => {
				async function MyComponent({}, { component }: Contexts) {
					component.renderSync(
						<Button key="btn">Click me</Button>
					);

					const events = component.waitEvents(component.domEvent('btn', 'click'));
					for await (const ev of events) {
						window.alert('Button clicked');
					}
				}

				start(div, MyComponent, {},
					// @ts-ignore
					{}
				);
			},
		},
		{
			slug: 'disables',
			name: 'Disabled button',
			description: 'A button that is initially disabled',
			renderFunction: async (div: HTMLDivElement) => {
				async function MyComponent({}, { component }: Contexts) {
					component.renderSync(
						<Button disabled key="btn">Click me</Button>
					);

					// This is not triggered because the button is disabled!
					const events = component.waitEvents(component.domEvent('btn', 'click'));
					for await (const ev of events) {
						window.alert('Button clicked');
					}
				}

				start(div, MyComponent, {},
					// @ts-ignore
					{}
				);
			},
		}
	]
};

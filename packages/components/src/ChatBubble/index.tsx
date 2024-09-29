import type { ComponentProps, Contexts } from "@seqflow/seqflow";

export interface ChatBubbleProps {
	spot: "start" | "end";
}

export async function ChatBubble(
	{ children, spot }: ComponentProps<ChatBubbleProps>,
	{ component, app }: Contexts,
) {
	const classes = ["chat"];
	// chat-start
	// chat-end
	classes.push(`chat-${spot}`);
	for (const c of classes) {
		component._el.classList.add(c);
	}

	if (!children) {
		app.log.error({
			message: "ChatBubble component requires children",
		});
		return;
	}

	component.renderSync(children);
}

export interface BubbleProps {
	color?:
		| "primary"
		| "secondary"
		| "accent"
		| "info"
		| "success"
		| "warning"
		| "error";
}

async function Bubble(
	{ children, color }: ComponentProps<BubbleProps>,
	{ component, app }: Contexts,
) {
	component._el.classList.add("chat-bubble");
	if (color) {
		// chat-bubble-primary
		// chat-bubble-secondary
		// chat-bubble-accent
		// chat-bubble-info
		// chat-bubble-success
		// chat-bubble-warning
		// chat-bubble-error
		component._el.classList.add(`chat-bubble-${color}`);
	}

	if (!children) {
		app.log.error({
			message: "ChatBubble.Bubble component requires children",
		});
		return;
	}
	component.renderSync(children);
}
ChatBubble.Bubble = Bubble;

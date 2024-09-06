import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";

export interface ChatBubbleProps {
	spot: "start" | "end";
}

export async function ChatBubble(
	this: SeqflowFunctionContext,
	{ children, spot }: SeqflowFunctionData<ChatBubbleProps>,
) {
	const classes = ["chat"];
	// chat-start
	// chat-end
	classes.push(`chat-${spot}`);
	for (const c of classes) {
		this._el.classList.add(c);
	}

	if (!children) {
		this.app.log.error({
			message: "ChatBubble component requires children",
		});
		return;
	}

	this.renderSync(children);
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
	this: SeqflowFunctionContext,
	{ children, color }: SeqflowFunctionData<BubbleProps>,
) {
	this._el.classList.add("chat-bubble");
	if (color) {
		// chat-bubble-primary
		// chat-bubble-secondary
		// chat-bubble-accent
		// chat-bubble-info
		// chat-bubble-success
		// chat-bubble-warning
		// chat-bubble-error
		this._el.classList.add(`chat-bubble-${color}`);
	}

	if (!children) {
		this.app.log.error({
			message: "ChatBubble.Bubble component requires children",
		});
		return;
	}
	this.renderSync(children);
}
ChatBubble.Bubble = Bubble;

import { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";

interface InnerChatBubbleProps {
	spot: 'start' | 'end',
}

export async function InnerChatBubble(
	this: SeqflowFunctionContext,
	{ children, spot }: SeqflowFunctionData<InnerChatBubbleProps>,
) {
	const classes = ["chat"];
	classes.push(`chat-${spot}`)
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
	color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
}

async function Bubble(
	this: SeqflowFunctionContext,
	{ children, color }: SeqflowFunctionData<BubbleProps>
) {
	this._el.classList.add('chat-bubble')
	if (color) {
		this._el.classList.add(`chat-bubble-${color}`)
	}

	if (!children) {
		this.app.log.error({
			message: 'ChatBubble.Bubble component requires children'
		})
		return;
	}
	this.renderSync(children)
}

export const ChatBubble = Object.assign(InnerChatBubble, {
	Bubble: Bubble
})
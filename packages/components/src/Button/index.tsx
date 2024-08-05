import { SeqflowFunction, SeqflowFunctionContext } from "seqflow-js";

export type ButtonComponent = HTMLElement & {
	transition: (state: {
		disabled?: boolean;
		loading?: boolean;
		replaceText?: string;
	}) => void;
};

export interface ButtonPropsType {
	/** The text */
	label: string;
	/** color */
	color?: "neutral" | "primary" | "secondary" | "accent" | "ghost" | "link";
	/** is active? */
	active?: boolean;
	state?: "info" | "success" | "warning" | "error";
	outline?: boolean;
	size?: "lg" | "normal" | "sm" | "xs";
	wide?: boolean;
	glass?: boolean;
	disabled?: boolean;
	loading?: boolean;
	type?: 'button' | 'submit';
	// TODO
	// responsive,
	// html input type
	// square?: boolean,
	// circle?: boolean,
}

export async function Button(
	this: SeqflowFunctionContext,
	{
		label,
		color,
		active,
		state,
		outline,
		size,
		wide,
		glass,
		disabled,
		loading,
		type,
	}: ButtonPropsType,
) {
	const classNames = ["btn"];
	if (color) {
		classNames.push(`btn-${color}`);
	}
	if (active) {
		classNames.push("btn-active");
	}
	if (outline) {
		classNames.push("btn-outline");
	}
	if (size && size !== "normal") {
		classNames.push(`btn-${size}`);
	}
	if (wide) {
		classNames.push("btn-wide");
	}
	if (glass) {
		classNames.push("glass");
	}
	if (disabled) {
		classNames.push("btn-disabled");
	}
	if (state) {
		classNames.push(`btn-${state}`);
	}

	const el = this._el as ButtonComponent;
	el.classList.add(...classNames);
	el.setAttribute("type", type ?? 'button');

	const loaderStyle = loading ? { display: "inherit" } : { display: "none" };

	this.renderSync(
		<>
			<span
				className="loading loading-spinner"
				key="loading"
				style={loaderStyle}
			/>
			{label || ""}
		</>,
	);

	const disable = () => {
		el.classList.add("btn-disabled");
		el.setAttribute("disabled", "disabled");
	};
	const enable = () => {
		el.classList.remove("btn-disabled");
		el.removeAttribute("disabled");
	};
	const makeLoading = () => {
		const loader = this.getChild("loading");
		loader.style.display = "inherit";
	};
	const removeLoading = () => {
		const loader = this.getChild("loading");
		loader.style.display = "none";
	};

	const previousTexts = [label];
	el.transition = (state: {
		disabled?: boolean;
		loading?: boolean;
		replaceText?: string;
	}) => {
		if (state.disabled) {
			disable();
		} else if (state.disabled === false) {
			enable();
		}
		if (state.loading) {
			makeLoading();
		} else if (state.loading === false) {
			removeLoading();
		}
		if (state.replaceText) {
			const textNode = el.childNodes[1];

			if (state.replaceText === "__previous__") {
				textNode.textContent = previousTexts.pop()!;
			} else {
				previousTexts.push(el.textContent!);
				textNode.textContent = state.replaceText;
			}
		}
	};
}
Button.tagName = () => "button";

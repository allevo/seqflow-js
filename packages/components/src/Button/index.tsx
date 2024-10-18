import type { ComponentProps, Contexts } from "@seqflow/seqflow";

export type ButtonComponent = HTMLElement & {
	transition: (state: {
		disabled?: boolean;
		loading?: boolean;
		replaceText?: ("__previous__" & {}) | string;
	}) => void;
};

export interface ButtonPropsType {
	/** color */
	color?:
		| "neutral"
		| "primary"
		| "secondary"
		| "accent"
		| "ghost"
		| "link"
		| "info"
		| "success"
		| "warning"
		| "error";
	/** is active? */
	active?: boolean;
	outline?: boolean;
	size?: "lg" | "normal" | "sm" | "xs";
	wide?: boolean;
	glass?: boolean;
	disabled?: boolean;
	loading?: boolean;
	type?: "button" | "submit";
	shape?: "circle" | "square";
	// TODO
	// responsive,
	// html input type
	// square?: boolean,
	// circle?: boolean,
}

export async function Button(
	{
		color,
		active,
		outline,
		size,
		wide,
		glass,
		disabled,
		loading,
		type,
		shape,
		children,
	}: ComponentProps<ButtonPropsType>,
	{ component }: Contexts,
) {
	const classNames = ["btn"];
	if (color) {
		/*
		btn-primary
		btn-secondary
		btn-accent
		btn-ghost
		btn-link
		btn-info
		btn-success
		btn-warning
		btn-error
		*/
		classNames.push(`btn-${color}`);
	}
	if (active) {
		classNames.push("btn-active");
	}
	if (outline) {
		classNames.push("btn-outline");
	}
	if (size && size !== "normal") {
		/*
		btn-lg
		btn-sm
		btn-xs
		*/
		classNames.push(`btn-${size}`);
	}
	if (wide) {
		classNames.push("btn-wide");
	}
	if (glass) {
		classNames.push("glass");
	}
	if (shape) {
		/*
		btn-circle
		*/
		classNames.push(`btn-${shape}`);
	}

	const el = component._el as ButtonComponent;
	el.classList.add(...classNames);
	el.setAttribute("type", type ?? "button");

	const loaderStyle = loading ? { display: "inherit" } : { display: "none" };

	if (Array.isArray(children)) {
		children = children.map((c) => {
			if (typeof c === "string") {
				return <span>{c}</span>;
			}
			return c;
		});
	}
	component._el.setAttribute("aria-live", "polite");
	component.renderSync(
		<>
			<span
				className="loading loading-spinner"
				key="loading"
				style={loaderStyle}
			/>
			<span key="loading-text" style={loaderStyle}>
				Loading...
			</span>
			{children}
		</>,
	);

	const disable = () => {
		el.classList.add("btn-disabled");
		el.setAttribute("disabled", "disabled");
	};

	if (disabled) {
		disable();
	}
	const enable = () => {
		el.classList.remove("btn-disabled");
		el.removeAttribute("disabled");
	};
	const makeLoading = () => {
		const loader = component.getChild("loading");
		loader.style.display = "inherit";
		const loadingText = component.getChild("loading-text");
		loadingText.style.display = "inherit";
		component._el.setAttribute("aria-busy", "true");
	};
	const removeLoading = () => {
		const loader = component.getChild("loading");
		loader.style.display = "none";
		const loadingText = component.getChild("loading-text");
		loadingText.style.display = "none";
		component._el.removeAttribute("aria-busy");
	};

	const previousChildren: HTMLElement[] | undefined = Array.from(
		component._el.childNodes,
	).filter((child) => {
		if (child instanceof Text) {
			return true;
		}
		if (!(child instanceof HTMLElement)) {
			return false;
		}
		const k = child.getAttribute("key");
		return k !== "loading" && k !== "loading-text";
	}) as HTMLElement[];

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
		if (state.replaceText && previousChildren) {
			if (state.replaceText === "__previous__") {
				for (const c of previousChildren) {
					c.style.display = "inherit";
				}
			} else {
				for (const c of previousChildren) {
					c.style.display = "none";
				}
			}
		}
	};
}
Button.tagName = () => "button";

import { SeqflowFunctionContext } from "seqflow-js";

export interface TextInputPropsType {
	placeholder?: string;
	withBorder?: boolean;
	color?:
		| "normal"
		| "primary"
		| "secondary"
		| "accent"
		| "info"
		| "success"
		| "warning"
		| "error"
		| "ghost";
	disabled?: boolean;
}

export async function TextInput(
	this: SeqflowFunctionContext,
	{
		placeholder,
		withBorder,
		color,
		disabled,
	}: {
		placeholder?: string;
		withBorder?: boolean;
		color?:
			| "normal"
			| "primary"
			| "secondary"
			| "accent"
			| "info"
			| "success"
			| "warning"
			| "error"
			| "ghost";
		disabled?: boolean;
	},
) {
	const classNames = ["input"];
	if (withBorder !== false) {
		classNames.push("input-bordered");
	}
	if (color && color !== "normal") {
		classNames.push(`input-${color}`);
	}

	this.renderSync(
		<input
			type="text"
			key="input"
			disabled={disabled ? true : undefined}
			placeholder={placeholder}
			className={classNames.join(" ")}
		/>,
	);
}

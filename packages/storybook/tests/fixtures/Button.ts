import { SeqflowFunctionContext } from "seqflow-js";

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
	// TODO
	// responsive,
	// html input type
	// square?: boolean,
	// circle?: boolean,
}

export async function Button(
	this: SeqflowFunctionContext,
	_: ButtonPropsType,
) {
	
}

import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";

export interface AlertPropsType {
	color?: "info" | "success" | "warning" | "error";
}

export async function Alert(
	this: SeqflowFunctionContext,
	{ color, children }: SeqflowFunctionData<AlertPropsType>,
) {
	const classNames = ["alert"];
	if (color) {
		/*
		alert-info
		alert-success
		alert-warning
		alert-error
		*/
		classNames.push(`alert-${color}`);
	}
	this._el.role = "alert";

	this._el.classList.add(...classNames);

	if (!children || (Array.isArray(children) && children.length === 0)) {
		this.app.log.error({
			message: "Alert component requires children",
		});
		return;
	}

	this.renderSync(children);
}

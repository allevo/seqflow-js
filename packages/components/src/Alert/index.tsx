import type { ComponentProps, Contexts } from "@seqflow/seqflow";

export interface AlertPropsType {
	color?: "info" | "success" | "warning" | "error";
}

export async function Alert(
	{ color, children }: ComponentProps<AlertPropsType>,
	{ component, app }: Contexts,
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
	component._el.role = "alert";

	component._el.classList.add(...classNames);

	if (!children || (Array.isArray(children) && children.length === 0)) {
		app.log.error({
			message: "Alert component requires children",
		});
		return;
	}

	component.renderSync(children);
}

import type { ComponentProps, Contexts } from "@seqflow/seqflow";

export interface LoadingPropsType {
	type?: "spinner" | "dots" | "ring" | "ball" | "bars" | "infinity";
	size?: "xs" | "sm" | "md" | "lg";
}

export async function Loading(
	{ type, size }: ComponentProps<LoadingPropsType>,
	{ component }: Contexts,
) {
	component._el.classList.add("loading");
	component._el.classList.add("loading-spinner");

	component._el.role = "progressbar";

	if (type) {
		// loading-spinner
		// loading-dots
		// loading-ring
		// loading-ball
		// loading-bars
		// loading-infinity
		component._el.classList.add(`loading-${type}`);
	}
	if (size) {
		// loading-xs
		// loading-sm
		// loading-md
		// loading-lg
		component._el.classList.add(`loading-${size}`);
	}
}

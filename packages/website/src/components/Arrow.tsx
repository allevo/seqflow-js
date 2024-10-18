import { ComponentProps, Contexts } from "@seqflow/seqflow";
import classes from "./Arrow.module.css";

export function ArrowSVG(_: ComponentProps<unknown>, { component }: Contexts) {
	const arrowSVG = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"svg",
	);
	arrowSVG.id = "chevron-down";
	const a = 128;
	arrowSVG.setAttribute("viewBox", "0 0 24 24");
	arrowSVG.classList.add(classes["down-arrow"]);

	arrowSVG.setAttribute("width", "48");
	arrowSVG.setAttribute("height", "48");
	// arrowSVG.setAttribute("viewBox", "0 0 24 24");
	arrowSVG.setAttribute("fill", "none");
	arrowSVG.setAttribute("stroke", "currentColor");
	arrowSVG.setAttribute("stroke-width", "2");
	arrowSVG.setAttribute("stroke-linecap", "round");
	arrowSVG.setAttribute("stroke-linejoin", "round");
	const polyline = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"polyline",
	);
	polyline.setAttribute("points", "6 9 12 15 18 9");
	arrowSVG.appendChild(polyline);

	component._el.appendChild(arrowSVG);
}

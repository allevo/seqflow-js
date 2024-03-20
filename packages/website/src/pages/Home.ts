import { ComponentParam } from "seqflow-js";
import classes from "./Home.module.css";

export async function Home({ dom }: ComponentParam) {
	dom.render(`
<div class="p-5 h-100 bg-body-tertiary">
	<div class="container-fluid" style="padding-top: 3vh;">
		<h1 class="display-5 fw-bold ${classes.brand}">SeqFlow</h1>
		<p class="col-md-8 fs-4">A framework to write products efficiently</p>
		<hr />
		<div class="${classes.container}">
			<ul class="${classes.foo}">
				<li class="${classes.item}">Events over State Management!</li>
				<li class="${classes.item}">Simplicity over Complexity</li>
				<li class="${classes.item}">Linearity over Complex Abstractions</li>
				<li class="${classes.item}">Explicitness over Implicitiveness</li>
			</ul>
		</div>
		<a href="/doc" class="btn btn-primary btn-lg" type="button">See documentation</a>
	</div>
</div>`);
}

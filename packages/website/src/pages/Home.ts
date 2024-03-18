import { ComponentParam } from "seqflow-js";
import classes from "./Home.module.css";

export async function Home({ dom }: ComponentParam) {
	dom.render(`
<div class="p-5 h-100 bg-body-tertiary rounded-3">
	<div class="container-fluid" style="padding-top: 3vh;">
		<h1 class="display-5 fw-bold ${classes.brand}">SeqFlow</h1>
		<p class="col-md-8 fs-4">Simplicity is the key</p>
		<a href="/doc" class="btn btn-primary btn-lg" type="button">See documentation</a>
		<div class="${classes.marqueeContainer}">
			<p class="${classes.marqueeContent}">
				<span>Events over State Management</span>
				<span class="${classes.marqueeSpace}"></span>
				<span>Simplicity over Complexity</span>
				<span class="${classes.marqueeSpace}"></span>
				<span>Linearity over Complex Abstractions</span>
				<span class="${classes.marqueeSpace}"></span>
				<span>Explicitness over Implicitiveness</span>
			</p>
		</div>
	</div>
</div>`);
}

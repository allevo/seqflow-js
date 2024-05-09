import { SeqflowFunctionContext } from "seqflow-js";
import classes from "./Home.module.css";

export async function Home(this: SeqflowFunctionContext) {
	this.renderSync(
		<div class="p-5 h-100">
			<div class="container-fluid" style="padding-top: 3vh;">
				<h1 class={`display-5 fw-bold ${classes.brand}`}>SeqFlow</h1>
				<p class="col-md-8 fs-4">A framework to write products efficiently</p>
				<hr />
				<div>
					<ul class={classes.list}>
						<li>Events over State Management</li>
						<li>Simplicity over Complexity</li>
						<li>Linearity over Complex Abstractions</li>
						<li>Explicitness over Implicitiveness</li>
					</ul>
				</div>
				<a
					href="/getting-started"
					class="btn btn-primary btn-lg"
					type="button"
					role="button"
				>
					See documentation
				</a>
			</div>
		</div>,
	);
}

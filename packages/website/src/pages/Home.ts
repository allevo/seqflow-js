import { ComponentParam } from "seqflow-js";

export async function Home({ dom }: ComponentParam) {
	dom.render(`
<div class="p-5 mb-4 bg-body-tertiary rounded-3">
	<div class="container-fluid py-5">
		<h1 class="display-5 fw-bold">SeqFlow</h1>
		<p class="col-md-8 fs-4">XXXXXX.</p>
		<a href="/doc" class="btn btn-primary btn-lg" type="button">See documentation</a>
	</div>
</div>`);
}

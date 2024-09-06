import type { SeqflowFunctionContext } from "seqflow-js";

export async function Checkout(this: SeqflowFunctionContext) {
	this.app.domains.cart.checkout();

	this.renderSync(
		<>
			<p>Well done!</p>
			<a key="go-home" href="/">
				Go home
			</a>
		</>,
	);

	const events = this.waitEvents(this.domEvent("click", { key: "go-home" }));
	for await (const ev of events) {
		ev.preventDefault();
		this.app.router.navigate("/");
	}
}

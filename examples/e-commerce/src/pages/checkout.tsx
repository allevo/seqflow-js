import { SeqflowFunctionContext } from "seqflow-js";

export async function Checkout(this: SeqflowFunctionContext) {
	this.app.domains.cart.checkout();

	const goHomeAfterCheckout = <a href="/">Go home</a>;

	this.renderSync(
		<>
			<p>Well done!</p>
			{goHomeAfterCheckout}
		</>,
	);

	const events = this.waitEvents(
		this.domEvent("click", { el: goHomeAfterCheckout }),
	);
	for await (const ev of events) {
		ev.preventDefault();
		this.app.router.navigate("/");
	}
}

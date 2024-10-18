import { ComponentProps, Contexts } from "@seqflow/seqflow";

export async function Checkout(
	_: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	app.domains.cart.checkout();

	component.renderSync(
		<>
			<p>Well done!</p>
			<a key="go-home" href="/">
				Go home
			</a>
		</>,
	);

	const events = component.waitEvents(component.domEvent("go-home", "click"));
	for await (const ev of events) {
		ev.preventDefault();
		app.router.navigate("/");
	}
}

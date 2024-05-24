import { SeqflowFunctionContext } from "seqflow-js";

interface Quote {
	author: string;
	content: string;
}

// Use the \`baseUrl\`
async function getRandomQuote(baseUrl: string): Promise<Quote> {
	const res = await fetch(`${baseUrl}/random`);
	return await res.json();
}

async function Quote(
	this: SeqflowFunctionContext,
	{ quote }: { quote: Quote },
) {
	this.renderSync(
		<>
			<div>{quote.content}</div>
			<div>{quote.author}</div>
		</>,
	);
}

async function Loading(this: SeqflowFunctionContext) {
	this.renderSync(<p>Loading...</p>);
}
async function ErrorMessage(
	this: SeqflowFunctionContext,
	data: { message: string },
) {
	this.renderSync(<p>{data.message}</p>);
}
async function Spot(this: SeqflowFunctionContext) {}

export async function Main(this: SeqflowFunctionContext) {
	const fetchAndRender = async () => {
		await this.replaceChild("quote", () => <Loading key="quote" />);

		let quote: Quote;
		try {
			// this.app.config is the configuration object
			quote = await getRandomQuote(this.app.config.api.baseUrl);
		} catch (error) {
			await this.replaceChild("quote", () => (
				<ErrorMessage key="quote" message={error.message} />
			));
			return;
		}
		this.replaceChild("quote", () => <Quote key="quote" quote={quote} />);
	};

	this.renderSync(
		<>
			<button key="refresh-button" type="button">
				Refresh
			</button>
			<Spot key="quote" />
		</>,
	);

	await fetchAndRender();

	const button = this.getChild("refresh-button") as HTMLButtonElement;
	const events = this.waitEvents(this.domEvent("click", "refresh-button"));
	for await (const _ of events) {
		button.disabled = true;
		await fetchAndRender();
		button.disabled = false;
	}
}

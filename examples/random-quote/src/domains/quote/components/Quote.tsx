import { ComponentProps, Contexts } from "@seqflow/seqflow";
import { Prose } from "@seqflow/components";
import type { Quote } from "../QuoteDomain";
import classes from "./Quote.module.css";

export async function QuoteComponent(
	data: ComponentProps<{ quote: Quote }>,
	{ component }: Contexts,
) {
	component.renderSync(
		<Prose className={classes.wrapper}>
			<blockquote className={classes.quote}>
				<p>{data.quote.content}</p>
			</blockquote>
			<cite className={classes.author}>{data.quote.author}</cite>
		</Prose>,
	);
}

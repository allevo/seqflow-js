import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";
import { Prose } from "seqflow-js-components";
import type { Quote } from "../QuoteDomain";
import classes from "./Quote.module.css";

export async function QuoteComponent(
	this: SeqflowFunctionContext,
	data: SeqflowFunctionData<{ quote: Quote }>,
) {
	this.renderSync(
		<Prose className={classes.wrapper}>
			<blockquote className={classes.quote}>
				<p>{data.quote.content}</p>
			</blockquote>
			<cite className={classes.author}>{data.quote.author}</cite>
		</Prose>,
	);
}

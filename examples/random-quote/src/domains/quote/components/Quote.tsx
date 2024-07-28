import { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";
import { Quote } from "../QuoteDomain";
import classes from './Quote.module.css';
import { Prose } from "seqflow-js-components";

export async function QuoteComponent(
	this: SeqflowFunctionContext,
	data: SeqflowFunctionData<{ quote: Quote }>,
) {
	this.renderSync(
			<Prose wrapperClass={classes.wrapper}>
				<blockquote className={classes.quote}><p>{data.quote.content}</p></blockquote>
				<cite className={classes.author}>{data.quote.author}</cite>
			</Prose>
	);
}

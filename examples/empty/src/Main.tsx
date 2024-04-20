import { SeqflowFunctionContext } from "seqflow-js";

export async function Main(this: SeqflowFunctionContext) {
	this.renderSync(<div>Hi!</div>);
}

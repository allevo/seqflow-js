import { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";

export interface LoadingPropsType {
	type?: 'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity';
	size?: 'xs' | 'sm' | 'md' | 'lg';
}

export async function Loading(
	this: SeqflowFunctionContext,
	{ type, size }: SeqflowFunctionData<LoadingPropsType>,
) {
	this._el.classList.add("loading");
	this._el.classList.add("loading-spinner");

	this._el.role = 'progressbar'

	if (type) {
		this._el.classList.add(`loading-${type}`);
	}
	if (size) {
		this._el.classList.add(`loading-${size}`);
	}
}

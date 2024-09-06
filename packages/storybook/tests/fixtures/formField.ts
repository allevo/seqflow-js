import { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";

export interface FormFieldPropsType {
	label: string | JSX.Element;
	errorMessage?: string | JSX.Element;
    size: number;
}

export async function FormField(
	this: SeqflowFunctionContext,
	{}: SeqflowFunctionData<FormFieldPropsType>,
) {
}
import { ComponentProps, Contexts } from "@seqflow/seqflow";

export interface FormFieldPropsType {
	label: string | JSX.Element;
	errorMessage?: string | JSX.Element;
    size: number;
}

export async function FormField(
	{}: ComponentProps<FormFieldPropsType>,
	c: Contexts,
) {
}
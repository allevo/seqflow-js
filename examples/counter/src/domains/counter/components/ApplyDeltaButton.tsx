import { Button } from "@seqflow/components";
import { ComponentProps, Contexts } from "@seqflow/seqflow";

export async function ApplyDeltaButton(
	{ delta, label }: ComponentProps<{ delta: number; label: string }>,
	{ component, app }: Contexts,
) {
	component.renderSync(
		<Button
			color="primary"
			onClick={() => app.domains.counter.applyDelta(delta)}
		>
			{label}
		</Button>,
	);
}

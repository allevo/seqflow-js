import { ComponentProps, Contexts, SeqFlowComponent } from "@seqflow/seqflow";
import classes from "./CardList.module.css";

export async function CardList<T extends { id: string }>(
	data: ComponentProps<{
		prefix: string;
		items: T[];
		Component: SeqFlowComponent<T>;
	}>,
	{ component }: Contexts,
) {
	component.renderSync(
		<ol className={classes.wrapper}>
			{data.items.map((item) => (
				<li
					key={item.id}
					className={classes.element}
					id={`${data.prefix}-${item.id}`}
				>
					<data.Component {...item} style={{ height: "100%" }} />
				</li>
			))}
		</ol>,
	);
}

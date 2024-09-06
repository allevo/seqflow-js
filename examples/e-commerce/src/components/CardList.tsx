import type { SeqflowFunctionContext } from "seqflow-js";
import classes from "./CardList.module.css";

export async function CardList<T extends { id: string }>(
	this: SeqflowFunctionContext,
	data: {
		prefix: string;
		items: T[];
		Component: (p: T) => Promise<void>;
	},
) {
	this.renderSync(
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

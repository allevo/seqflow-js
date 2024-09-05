import { SeqflowFunctionContext } from "seqflow-js";
import { Button, Heading, Hero, Link } from "seqflow-js-components";
import classes from "./Home.module.css";

export async function Home(this: SeqflowFunctionContext) {
	this.renderSync(
		<Hero>
			<Hero.Content className="text-center">
				<div className={"max-w-3xl"}>
					<Heading level={1} className="text-5xl font-bold">
						SeqFlowJS
						<br />
						<small className="text-2xl">
							A framework to write products efficiently
						</small>
					</Heading>
					<ul className={classes.list}>
						<li>Events over State Management</li>
						<li>Simplicity over Complexity</li>
						<li>Linearity over Complex Abstractions</li>
						<li>Explicitness over Implicitiveness</li>
					</ul>
					<Link href="/getting-started" showAsButton="primary">
						Get Started
					</Link>
				</div>
			</Hero.Content>
		</Hero>,
	);
}

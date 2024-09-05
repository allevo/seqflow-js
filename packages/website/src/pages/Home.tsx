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
	/*
	this.renderSync(
		<div className="p-5 h-100">
			<div className="container-fluid" style="padding-top: 3vh;">
				<h1 className={`display-5 fw-bold ${classes.brand}`}>SeqFlow</h1>
				<p className="col-md-8 fs-4">
					A framework to write products efficiently
				</p>
				<hr />
				<div>
					<ul className={classes.list}>
						<li>Events over State Management</li>
						<li>Simplicity over Complexity</li>
						<li>Linearity over Complex Abstractions</li>
						<li>Explicitness over Implicitiveness</li>
					</ul>
				</div>
				<a
					href="/getting-started"
					className="btn btn-primary btn-lg"
					type="button"
					role="button"
				>
					See documentation
				</a>
			</div>
		</div>,
	);
	*/
}

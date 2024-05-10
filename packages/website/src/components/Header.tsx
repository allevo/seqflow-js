import { SeqflowFunctionContext } from "seqflow-js";
import githubLogoAsString from "../public/images/github.svg";
import logoAsString from "../public/images/logo.svg";
import "./Header.css";

function getSvg(html: string) {
	const div = document.createElement("div");
	div.innerHTML = html;
	return div.children[0] as HTMLElement;
}

export async function Header(this: SeqflowFunctionContext) {
	const svg = getSvg(logoAsString(30, 30));
	const githubLogo = getSvg(githubLogoAsString(30, 30));

	const anchor = (
		<a className="navbar-brand" href="/" id="seqflow-anchor">
			{svg}
			SeqFlow
		</a>
	);
	this.renderSync(
		<nav className="navbar navbar-expand-lg bg-body-tertiary">
			<div className="container-fluid">
				{anchor}
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarSupportedContent"
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon" />
				</button>
				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						<li className="nav-item">
							<a
								className="nav-link"
								href="/getting-started"
								id="getting-started-link"
							>
								Getting started
							</a>
						</li>
						<li className="nav-item">
							<a
								className="nav-link"
								aria-current="page"
								href="/why"
								id="why-link"
							>
								Why
							</a>
						</li>
						<li className="nav-item">
							<a
								className="nav-link"
								href="/api-reference"
								id="api-reference-link"
							>
								Api Reference
							</a>
						</li>
						<li className="nav-item dropdown">
							<button
								type="button"
								className="nav-link dropdown-toggle"
								data-bs-toggle="dropdown"
								id="exampleDropdownMenuLink"
								data-toggle="dropdown"
								aria-haspopup="true"
								aria-expanded="false"
							>
								Examples
							</button>
							<div
								className="dropdown-menu"
								aria-labelledby="exampleDropdownMenuLink"
							>
								<a className="dropdown-item" href="/examples#counter">
									Counter
								</a>
								<a className="dropdown-item" href="/examples#e-commerce">
									E-Commerce
								</a>
								<div className="dropdown-divider" />
								<a className="dropdown-item" href="/examples#web-component">
									Custom Element with Shadow DOM
								</a>
							</div>
						</li>
					</ul>
					<div className="navbar-nav">
						<a
							aria-label="github"
							rel="noreferrer"
							target="_blank"
							href="https://github.com/allevo/seqflow-js"
							className="nav-link"
						>
							<span style="color: white; fill: currentColor;">
								{githubLogo}
							</span>
							<span className="github-name" style="margin-left: 10px;">
								GitHub
							</span>
						</a>
					</div>
				</div>
			</div>
		</nav>,
	);
}

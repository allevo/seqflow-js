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
		<a class="navbar-brand" href="/" id="seqflow-anchor">
			{svg}
			SeqFlow
		</a>
	);
	this.renderSync(
		<nav class="navbar navbar-expand-lg bg-body-tertiary">
			<div class="container-fluid">
				{anchor}
				<button
					class="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarSupportedContent"
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span class="navbar-toggler-icon" />
				</button>
				<div class="collapse navbar-collapse" id="navbarSupportedContent">
					<ul class="navbar-nav me-auto mb-2 mb-lg-0">
						<li class="nav-item">
							<a
								class="nav-link"
								href="/getting-started"
								id="getting-started-link"
							>
								Getting started
							</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" aria-current="page" href="/why" id="why-link">
								Why
							</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="/api-reference" id="api-reference-link">
								Api Reference
							</a>
						</li>
					</ul>
					<div class="navbar-nav">
						<a
							aria-label="github"
							rel="noreferrer"
							target="_blank"
							href="https://github.com/allevo/seqflow-js"
							class="nav-link"
						>
							<span style="color: white; fill: currentColor;">
								{githubLogo}
							</span>
							<span class="github-name" style="margin-left: 10px;">
								GitHub
							</span>
						</a>
					</div>
				</div>
			</div>
		</nav>,
	);
}

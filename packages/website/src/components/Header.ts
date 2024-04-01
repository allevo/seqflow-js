import { ComponentParam } from "seqflow-js";
import logo from "../public/images/logo.svg";
import githuLogo from "../public/images/github.svg";

const str = `
<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="/" id="seqflow-anchor">
      ${logo(30, 30)}
      SeqFlow
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link" href="/getting-started" id="getting-started-link">Getting started</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" aria-current="page" href="/why" id="why-link">Why</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/api-reference" id="api-reference-link">Api Reference</a>
        </li>
      </ul>
    </div>
    <a aria-label="github" rel="noopener" target="_blank" href="https://github.com/allevo/seqflow-js" style="color: white; fill: currentColor;">
      ${githuLogo(30, 30)}
    </a>
  </div>
</nav>`;

export async function Header({ dom, event, router }: ComponentParam) {
	dom.render(str);

	const seqflowAnchor = dom.querySelector("#seqflow-anchor");
	const whyAncor = dom.querySelector("#why-link");
	const docAnchor = dom.querySelector("#getting-started-link");
	const apiReferenceAnchor = dom.querySelector("#api-reference-link");
	const elements = [seqflowAnchor, whyAncor, docAnchor, apiReferenceAnchor];
	const anchors = Array.from(dom.querySelectorAll("a")) as HTMLAnchorElement[];

	const currentPath = new RegExp(router.segments.shift(), "i");
	const currentAnchor = anchors.find((el) => currentPath.test(el.href));
	if (currentAnchor) {
		currentAnchor.classList.add("active");
	}

	const events = event.waitEvent(event.domEvent("click"));
	for await (const e of events) {
		const anchor = elements.find((el) => el.contains(e.target as Node));
		if (anchor instanceof HTMLAnchorElement) {
			router.navigate(anchor.href);

			for (const anchor of anchors) {
				anchor.classList.remove("active");
			}
			anchor.classList.add("active");
		}
	}
}

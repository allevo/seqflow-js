import { ComponentParam } from "seqflow-js";

const str = `
<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="/" id="seqflow-anchor">SeqFlow</a>
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
          <a class="nav-link active" aria-current="page" href="/why" id="why">Why</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/doc" id="doc">Doc</a>
        </li>
      </ul>
    </div>
  </div>
</nav>`;

export async function Header({ dom, event, router }: ComponentParam) {
	dom.render(str);

	const seqflowAnchor = dom.querySelector("#seqflow-anchor");
	const whyAncor = dom.querySelector("#why");
	const docAnchor = dom.querySelector("#doc");
	const elements = [seqflowAnchor, whyAncor, docAnchor];

	const events = event.waitEvent(event.domEvent("click"));
	for await (const e of events) {
		if (elements.some((el) => el.contains(e.target as Node))) {
			const target = e.target as HTMLAnchorElement;
			router.navigate(target.href);
		}
	}
}

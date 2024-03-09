import { ComponentParam } from "seqflow-js";

const str = `
<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="/" id="seqflow-anchor">
    <svg width="30" height="30" viewBox="0 0 596 572" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_ddi_754_53)">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M529 177.844L381.951 177.844H362L268.542 177.844C220.972 177.844 182.409 216.408 182.409 263.978L182.409 309.916L67.5645 309.916L67.5645 263.978C67.5645 152.981 157.545 63 268.542 63L362 63L381.951 63L529 63V177.844ZM383.387 254V253.929H268.542V299.867C268.542 347.437 229.979 386 182.409 386H69V500.844H182.409C269.172 500.844 343.094 445.865 371.237 368.844H457.587L457.587 254L383.387 254Z" fill="white"/>
      </g>
      <defs>
      <filter id="filter0_ddi_754_53" x="0.564514" y="0" width="595.435" height="571.845" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="4"/>
      <feGaussianBlur stdDeviation="2"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_754_53"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="4"/>
      <feGaussianBlur stdDeviation="33.5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_754_53" result="effect2_dropShadow_754_53"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_754_53" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="4" dy="4"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
      <feBlend mode="normal" in2="shape" result="effect3_innerShadow_754_53"/>
      </filter>
      </defs>
    </svg>

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
          <a class="nav-link" aria-current="page" href="/why" id="why">Why</a>
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
  const anchors = Array.from(dom.querySelectorAll("a")) as HTMLAnchorElement[];

  const currentPath = new RegExp(router.segments.shift(), "i");
  const currentAnchor = anchors.find(el => currentPath.test(el.href));
  if (currentAnchor) {
    currentAnchor.classList.add("active");
  }

	const events = event.waitEvent(event.domEvent("click"));
	for await (const e of events) {
    const anchor = elements.find((el) => el.contains(e.target as Node))
		if (anchor instanceof HTMLAnchorElement) {
			router.navigate(anchor.href);

      for (const anchor of anchors) {
        anchor.classList.remove("active");
      }
      anchor.classList.add("active");
		}
	}
}

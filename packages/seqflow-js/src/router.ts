export class NavigationEvent extends Event {
	constructor(public path: string) {
		super("navigation");
	}
}

export interface Router {
	/**
	 *
	 * @param path The path to navigate to. It should be a domain relative path.
	 */
	navigate(path: string): void;
	/**
	 * Returns the segments of the current path.
	 */
	readonly segments: string[];
	/**
	 * Navigates back in the history.
	 */
	back(): void;
	/**
	 * Installs the router. It is used internally by the framework.
	 */
	install(): void;
	/**
	 * Get the event target. It is used internally by the framework.
	 */
	getEventTarget(): EventTarget;
}

export class BrowserRouter implements Router {
	constructor(private eventTarget: EventTarget) {}

	install() {
		window.addEventListener("popstate", (ev) => {
			const e = ev as PopStateEvent;
			e.preventDefault();

			// TODO: we should calculate the new path and dispatch a navigation event
			this.eventTarget.dispatchEvent(
				new NavigationEvent(window.location.pathname),
			);
		});
	}

	getEventTarget() {
		return this.eventTarget;
	}

	navigate(path: string) {
		window.history.pushState({}, "", path);
		this.eventTarget.dispatchEvent(new NavigationEvent(path));
	}

	back() {
		window.history.back();
	}

	public get segments(): string[] {
		const segments = window.location.pathname.split("/");
		// URL starts with a slash, so the first element is always an empty string
		segments.shift();
		return segments;
	}
}

interface HistoryEntry {
	path: string;
}

export class InMemoryRouter implements Router {
	private history: HistoryEntry[] = [];

	constructor(
		private eventTarget: EventTarget,
		currentPath: string,
	) {
		this.history.push({ path: currentPath });
	}

	public get segments(): string[] {
		const segments = this.history[this.history.length - 1].path.split("/");
		// URL starts with a slash, so the first element is always an empty string
		segments.shift();
		return segments;
	}

	install() {}

	getEventTarget() {
		return this.eventTarget;
	}

	navigate(path: string) {
		// NB: only domain relative paths are supported
		// TODO: handle path relative paths
		// TODO: handle absolute paths
		// TODO: what if the path is equal to the current path?
		this.history.push({ path });
		this.eventTarget.dispatchEvent(new NavigationEvent(path));
	}

	back() {
		if (!this.history.length) {
			// What if the programmer calls back() when there is no history?
			// Should we throw an error?
			// For now, we just return ignoring the call.
			return;
		}

		this.history.pop();
		const last = this.history[this.history.length - 1];
		if (last) {
			this.eventTarget.dispatchEvent(new NavigationEvent(last.path));
		}
	}
}

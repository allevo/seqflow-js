import type { ComponentProps, Contexts } from "@seqflow/seqflow";

export interface ModalType {
	closeOnClickOutside?: boolean;
	modalBoxClassName?: string | string[];
}

export async function Modal(
	{
		children,
		closeOnClickOutside,
		modalBoxClassName,
	}: ComponentProps<ModalType>,
	{ component, app }: Contexts,
) {
	component._el.classList.add("modal");

	let outside = undefined;
	if (closeOnClickOutside) {
		outside = (
			<form method="dialog" class="modal-backdrop">
				<button type="submit">close</button>
			</form>
		);
	}

	const modalBoxClasses = ["modal-box"];
	if (modalBoxClassName) {
		if (Array.isArray(modalBoxClassName)) {
			modalBoxClasses.push(...modalBoxClassName);
		} else {
			modalBoxClasses.push(modalBoxClassName);
		}
	}

	component.renderSync(
		<>
			<div className={modalBoxClasses}>{children}</div>
			{outside}
		</>,
	);
}
Modal.tagName = () => "dialog";

export async function ModalAction(
	{ children }: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	component._el.classList.add("modal-action");

	component.renderSync(children);
}

export async function ModalClose(
	{ children }: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	const form = component._el as HTMLFormElement;
	form.method = "dialog";
	component.renderSync(children);
}
ModalClose.tagName = () => "form";

Modal.Action = ModalAction;
Modal.Close = ModalClose;
Object.assign(Modal, {
	Action: ModalAction,
	Close: ModalClose,
});

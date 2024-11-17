import type { ComponentProps, Contexts } from "@seqflow/seqflow";
import { domEvent } from "@seqflow/seqflow/dist/src/events";
import { Modal, ModalType } from ".";
import { Button } from "../Button";

async function ModalStory(
	{ children, ...props }: ComponentProps<ModalType>,
	{ component }: Contexts,
) {
	component.renderSync(
		<>
			<Button type="button" key="open-modal" className="btn">
				Open Modal
			</Button>
			<Modal {...props} key="modal" closeOnClickOutside>
				<Modal.Close>
					<Button
						type="submit"
						shape="circle"
						color="ghost"
						className="btn-sm absolute right-2 top-2"
					>
						✕
					</Button>
				</Modal.Close>
				This is a modal
				<Modal.Action>
					<form method="dialog">
						<Button type="submit" key="close-modal" className="btn">
							Close
						</Button>
					</form>
				</Modal.Action>
			</Modal>
		</>,
	);

	const modal = component.getChild<HTMLDialogElement>("modal");

	const events = component.waitEvents(
		component.domEvent("open-modal", "click"),
	);
	for await (const event of events) {
		modal.showModal();
	}
}
// biome-ignore lint/suspicious/noExplicitAny: storybook
ModalStory.__storybook = (ModalStory as any).__storybook;

export default {
	title: "Example/Modal",
	tags: ["autodocs"],
	component: ModalStory,
	args: {},
};

export const Empty = {};

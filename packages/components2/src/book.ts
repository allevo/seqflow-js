import { ComponentBook, type ComponentsConfiguration } from "@seqflow/component-book";
import { ButtonDoc } from "./Button/Button.stories";

async function configure(book: ComponentBook) {
    book.registerComponentPage(ButtonDoc);
}

const componentsConfiguration: ComponentsConfiguration = {
    configure,
}

export default componentsConfiguration;

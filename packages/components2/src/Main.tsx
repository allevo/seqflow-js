import { Contexts } from "@seqflow/seqflow";
import componentList from "@seqflow/document-component-lib/list";
import { Book, ComponentDoc } from "@seqflow/document-component-lib";
import { ButtonDoc } from "./Button/Button.stories";

export async function Main({}, { component, app }: Contexts) {

    app.domains.book.registerComponentPage(ButtonDoc);

    component.renderSync(
        <ComponentDoc componentList={componentList} />
    )
}


declare module "@seqflow/seqflow" {
    interface Domains {
        book: Book;
    }
}

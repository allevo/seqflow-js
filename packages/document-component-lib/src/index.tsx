import { Contexts } from "@seqflow/seqflow";
import { Book } from "./domains/book/index";
export { Book, type ComponentPage } from "./domains/book/index";

export async function ComponentDoc({
    componentList
}: {
    componentList: string[];
}, { component, app }: Contexts) {
    const book = app.domains.book;

    component.renderSync(
        <ul>
            {
                book.pages.map((doc) => {
                    return (
                        <li>
                            <p>{doc.component.name}</p>
                            <ol>
                                {
                                    doc.stories.map((story) => {
                                        return (
                                            <li>
                                                <p>{story.name}</p>
                                            </li>
                                        );
                                    })
                                }
                            </ol>
                        </li>
                    );
                })
            }
        </ul>
    )
}


declare module "@seqflow/seqflow" {
    interface Domains {
        book: Book;
    }
}


import { start, Contexts } from "@seqflow/seqflow";
import { ComponentBook } from "./domains/book/index";
export { ComponentBook, type ComponentPage } from "./domains/book/index";


export async function ComponentDoc(_: unknown, { component, app }: Contexts) {
    const book = app.domains.book;

    
    const config: {
        default: ComponentsConfiguration
        // @ts-ignore
    } = await import('./components.js');

    console.log(config);

    await config.default.configure(book);

    component.renderSync(
        <>
            <h1>Component book</h1>
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
        </>
    )
}

export interface ComponentsConfiguration {
    configure: (book: ComponentBook) => Promise<void>;
}

declare module "@seqflow/seqflow" {
    interface Domains {
        book: ComponentBook;
    }
}


const root = document.getElementById('root');

start(root!, ComponentDoc, {}, {
    log: console,
    domains: {
        book: (et) => new ComponentBook()
    }
});

import { start, Contexts, SeqFlowComponent, NavigationEvent } from "@seqflow/seqflow";
import { ComponentBook, ComponentPropertyType } from "./domains/book/index";
export { ComponentBook, type ComponentPage } from "./domains/book/index";

import * as Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import "prismjs/plugins/toolbar/prism-toolbar.css";

// The order of the following imports are important.
// So, we have to keep the empty line between them, otherwise the linter will complain.

import "prismjs/plugins/toolbar/prism-toolbar";

import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard";

import './index.css'

export async function Sidebar({}, { component, app }: Contexts) {
    const book = app.domains.book;

    component.renderSync(
        <>
            <a href="/">
                <h1>
                    Component book
                </h1>
            </a>
            <ul>
                {
                    book.pages.map((doc) => {
                        return (
                            <li>
                                <p>
                                    <a href={`/components/${doc.component.slug}`}>
                                        {doc.component.name}
                                    </a>
                                </p>
                            </li>
                        );
                    })
                }
            </ul>
        </>
    )

    const events = component.waitEvents(
        component.domEvent(component._el, 'click', { preventDefault: true })
    );
    for await (const event of events) {
        if (!(event.target instanceof HTMLElement)) {
            continue;
        }
        const target = event.target as HTMLElement;

        const parentAnchor = target.closest('a');
        if (parentAnchor) {
            const href = parentAnchor.getAttribute('href');
            if (href) {
                app.log.info({
                    message: 'Navigating',
                    data: {
                        href
                    }
                });
                app.router.navigate(href);
            }
        }
    }
}
Sidebar.tagName = () => 'navbar'

function Empty() {}
function NotFound() {}

function mapSegmentsToComponent(segments: string[]): SeqFlowComponent<{}> {
    console.log(segments)
    if (segments[0] === '') {
        return Empty;
    }

    if (segments[0] === 'components') {
        const componentSlug = segments[1];
        if (!componentSlug) {
            return NotFound;
        }

        if (segments.length === 2) {
            return ComponentDoc;
        }
    }

    return NotFound;
}

async function ComponentDoc({}, { component, app }: Contexts) {
    const componentPage = app.domains.book.getComponentPageBySlug(app.router.segments[1]);
    if (!componentPage) {
        return;
    }

    console.log(componentPage);

    const data = componentPage.component.props
    const stories = componentPage.stories;
    const storiesCodes = (componentPage as { originalRenderFunctions?: string[] }).originalRenderFunctions;

    const renderVariant = (type: ComponentPropertyType) => {
        if (type.t === 'union') {
            return type.type.map((t, i, arr) => {
                return (
                    <>
                        <code>{t.type}</code>
                        {i !== arr.length - 1 ? ' | ' : ''}
                    </>
                );
            });
        }
        return <></>;
    };

    const renderType = (type: ComponentPropertyType) => {
        switch (type.t) {
            case 'basic':
                return type.type;
            case 'literal':
                return type.type;
            case 'unknown':
                return type.type;
            case 'union':
                return <></>;
            default:
                throw new Error('Unknown type');
        }
    };

    component.renderSync(
        <>
            <h1>
                {componentPage.component.name}
            </h1>

            <h2>Props</h2>
            <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Required</th>
                        <th>Type</th>
                        <th>Variant</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(data).map((key) => (
                    <tr key={key}>
                        <td>{data[key].name}</td>
                        <td>{data[key].description || '-'}</td>
                        <td>{data[key].required ? 'Yes' : 'No'}</td>
                        <td>{renderType(data[key].type)}</td>
                        <td>{renderVariant(data[key].type)}</td>
                    </tr>
                    ))}
                </tbody>
            </table>

            <h2>Stories</h2>

            <ul>
                {stories.map((story, index) => {
                    const mountPoint = document.createElement('div');

                    const shadow = mountPoint.attachShadow({ mode: "closed" });
                    const l = document.createElement('link') as HTMLLinkElement;
                    l.rel = 'stylesheet';
                    l.href = '/lib.css';
                    shadow.appendChild(l);
                    const inner = document.createElement("div");
                    shadow.appendChild(inner);

                    story.renderFunction(inner)
                        .catch(e => app.log.error({
                            message: 'Error rendering story',
                            data: {
                                story: story.name,
                                component: componentPage.component.name,
                                error: e,
                            }
                        }));
                    const code = storiesCodes?.[index];
                    let details = null;
                    if (code) {

                        const html = Prism.highlight(code, Prism.languages.tsx, 'tsx');
                        details = (
                            <details>
                                <summary>Show the code</summary>
                            </details>
                        ) as HTMLElement;
                        details.innerHTML += `<pre><code>${html}</code></pre>`;
                    }
                    return (
                        <li>
                            {story.name}{story.description ? ` - ${story.description}` : ''}
                            {mountPoint}
                            {details}
                        </li>
                    );
                })}
            </ul>

        </>
    )


	Prism.highlightAll();
}

export async function Book(_: unknown, { component, app }: Contexts) {
    const book = app.domains.book;

    const config: {
        default: ComponentsConfiguration,
        // @ts-ignore
    } = await import('./components.js');

    await config.default.configure(book);

    const segments = app.router.segments;
    const MainComponent = mapSegmentsToComponent(segments);

    component.renderSync(
        <>
            <header className="topbar">
                <div className="logo">Logo</div>
                <button type="button" key="menu-toggle" className="menu-toggle">☰</button>
            </header>

            <div className="container">
                <Sidebar key="sidebar" className="sidebar"></Sidebar>

                <MainComponent className="content" key="main-component" />
            </div>
        </>
    )
    const events = component.waitEvents(
        component.navigationEvent(),
        component.domEvent('menu-toggle', 'click')
    );
    for await (const ev of events) {
        if (ev instanceof NavigationEvent) {
            const MainComponent = mapSegmentsToComponent(app.router.segments);
            component.replaceChild('main-component', () => <MainComponent className="content" key="main-component" />);
        } else {
            component.getChild('sidebar')?.classList.toggle('open');
        }
    }
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

start(root!, Book, {}, {
    log: console,
    domains: {
        book: (et) => new ComponentBook()
    }
});

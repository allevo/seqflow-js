import React from 'react';
import { Button } from '../src/index.tsx';
import * as seqflow from 'seqflow-js'

async function Main(this: seqflow.SeqflowFunctionContext) {
    this.renderSync(
        this.createDOMElement(
            Button,
            {},
            ['Hello']
        )
    )
    // this.renderSync(
    //     <div>
    //         <Button title="Hello" />
    //     </div>
    // )
}

// await new Promise((resolve) => setTimeout(resolve, 1000))

/*
let r: HTMLElement | null
do {
    await new Promise((resolve) => setTimeout(resolve, 300))
    r = document.body.querySelector<HTMLElement>('.sbdocs-content')
    console.log(r)
} while(!r);

console.log(document, r)
seqflow.start(r, Main, { }, {})

*/

export default function Init() {
    const ref = React.createRef<HTMLElement | null>(null)
    React.useEffect(() => {
        if (ref.current) {
            const control = seqflow.start(ref.current, Main, { }, {})
            return () => {
                control.abort(new Error('React unmount'))
            }
        }
    }, [ref.current])

    return React.createElement('div', { id: 'root', ref }, ['aa'])
}
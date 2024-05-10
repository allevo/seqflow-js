# Custom Element Example: Counter

This project is created to demonstrate how to create a web component using SeqFlow. It is so simple!

In this example, we have a simple counter that increments and decrements the value. The counter is defined as a `SeqFlow` component and used in the `CounterElement` class.

The example shows how to create a web component using `SeqFlow` and use it in a simple HTML file. Moreover, the example demonstrates how to handle the attribute changes of the web component.

## How to run

Because custom elements are tricky, this repo uses three kinds of tests.

### Development mode

This allows you to test and develop the web component. It does not use shadow DOM, so it is easier to debug.

```bash
pnpm start
```

### Unit test
The following command runs the unit tests, as normal.
```bash
pnpm test
```

### Build mode
Because the production mode is different from the development mode, you need to build the web component and test it in a real environment. To do so, this repo provides a simple HTML file that uses the web component.

```bash
pnpm build
pnpm run test:html
```

Open [http://localhost:3000/test.html](http://localhost:3000/test.html) in your browser.

## Project structure

- `src/index.ts`: The main file that defines the web component. It defines a `CounterElement` class as `my-counter-element` custom element. It initializes the application.
- `src/Counter.tsx`: A classic `SeqFlow` component that defines the counter.
- `test.html`: An example usage of the `my-counter-element` custom element like a production environment.

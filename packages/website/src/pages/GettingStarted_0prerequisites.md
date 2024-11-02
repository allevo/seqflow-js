Welcome to SeqFlow getting started!

Here you can find the basic concept of the framework and how it can help your development. If you looking for a deep analysis about the reason, there's a dedicated page [here](/why "the reason of SeqFlow").

Are you looking for more complex examples? Check the <a href="/examples">examples page</a>.

## Prerequisites

Before we start, you need to have installed the following tools:
- [Node.js](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation)

You can still use `npm` or `yarn`, but we didn't test it with these tools. If you encounter any issues, <a target="_blank" href="https://github.com/allevo/seqflow-js/pulls">let us know</a>.

## Project creation
The first step to start a new project is to create it using the CLI. The command is:
```sh
pnpm create seqflow@latest --template empty
```

This command will ask you some questions about the project, like where to place the project.

For the purpose of this documentation, we will use the empty template, but you can choose another one running the previous command without `--template empty` argument.

Opening the project folder, you may see some files and folders. The most important are:

- `src/index.css`: the main CSS file
- `src/index.html`: the main HTML file
- `src/index.ts`: the entrypoint file
- `src/Main.module.css`: the CSS module file for Main component
- `src/Main.tsx`: the Main component
- `package.json`: the dependencies and devDependencies are fulfilled
- `biome.json`: the project formatter configuration
- `vite.config.js`: the Vite configuration file
- `vitest.config.ts`: the Vitest configuration file. We will talk about it later
- `tests/index.test.ts`: the test file. Test part is covered at the end of this page

For now, we will focus only on `src/Main.tsx` file. You can split the file content into multiple files, but for this example, we will keep everything in the same file, for copy-paste reasons.

## Run it locally

Before we start, let's install the dependencies. Run the command `pnpm install` to install the dependencies.

Let's start the application and see the result. Run the command `pnpm start`.<br />
Open your browser and go to <a title="localhost" target="_blank" href="http://localhost:5173">http://localhost:5173</a>. You should see a blank page with a text.

## Conclusion

In this tutorial, we have learned how to create a simple application using SeqFlow and how to run it locally.

Anyways, we are not done yet. Let's move on: our goal is to write an application that shows random quote fetched from an endpoint.

:::next:::
{"label": "Learn how to fetch data", "next": "/getting-started/fetch-data"}
:::end-next:::

import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import prompts, { type PromptObject } from "prompts";
import tar from "tar";

enum TemplateType {
	Empty = "empty",
	Counter = "counter",
	ECommerce = "e-commerce",
	CustomElement = "custom-element",
	RandomQuote = "random-quote",
}
const templateChoices = [
	{
		title: TemplateType.Empty,
		description: "Empty application",
		value: TemplateType.Empty,
	},
	{
		title: TemplateType.Counter,
		description: "Simple counter example",
		value: TemplateType.Counter,
	},
	{
		title: TemplateType.RandomQuote,
		description: "Fetch and display a random quote",
		value: TemplateType.RandomQuote,
	},
	{
		title: TemplateType.ECommerce,
		description: "E-commerce example with multiple domains",
		value: TemplateType.ECommerce,
	},
	{
		title: TemplateType.CustomElement,
		description: "Custom element example",
		value: TemplateType.CustomElement,
	},
];

interface Configuration {
	absolutePath: string;
	projectName: string;
	branch: string;
	type: TemplateType;
}

function parseArguments(args: string[]): Partial<Configuration> {
	if (args.length === 0) {
		return {};
	}
	const configurationFromCMD: Partial<Configuration> = {};

	let i = 0;
	while (i < args.length) {
		const arg = args[i];
		if (arg === "--path" || arg === "-p") {
			configurationFromCMD.absolutePath = args[i + 1];
			i += 2;
		} else if (arg === "--name" || arg === "-n") {
			configurationFromCMD.projectName = args[i + 1];
			i += 2;
		} else if (arg === "--template" || arg === "-t") {
			configurationFromCMD.type = args[i + 1] as TemplateType;
			i += 2;
		} else if (arg === "--branch" || arg === "-b") {
			configurationFromCMD.branch = args[i + 1];
			i += 2;
		} else if (arg === "--help" || arg === "-h") {
			const availableTemplates = templateChoices.map((t) => t.title).join(", ");
			console.log(`
Usage: create-seqflow [options]

Options:
  --path, -p     The destination path of the project
  --name, -n     The name of the project
  --template, -t The template to use (${availableTemplates})
  --branch, -b   The branch to use
  --help, -h     Display this help message
`);
			process.exit(0);
		} else {
			throw new Error(
				`Unknown option: ${arg}. Allowed options are: --path, --name, --template, --branch.`,
			);
		}
	}

	return configurationFromCMD;
}

async function collectInformation({
	type,
	branch,
}: Partial<Configuration>): Promise<Configuration> {
	const questions: PromptObject[] = [
		{
			type: "text",
			name: "path",
			message: "Where do you want to create the project?",
			initial: "./my-seqflow-app",
		},
	];
	if (!type) {
		questions.push({
			type: "select",
			name: "type",
			message: "Choose the a template",
			choices: templateChoices,
			initial: 0,
		});
	}

	const response = await prompts(questions);
	const absolutePath = path.resolve(response.path.trim());

	const projectName = path.basename(absolutePath);

	return {
		type: response.type || type,
		absolutePath,
		projectName,
		branch: branch || "main",
	};
}

async function createApp(config: Configuration) {
	// Check destination path
	fs.mkdirSync(config.absolutePath, { recursive: true });
	const conflicts = fs
		.readdirSync(config.absolutePath)
		.filter((file) => !file.startsWith("."));
	if (conflicts.length > 0) {
		throw new Error(
			`The directory ${config.absolutePath} is not empty: ${conflicts.join(
				", ",
			)}`,
		);
	}
	fs.accessSync(config.absolutePath, fs.constants.W_OK);

	// Download and extract the template
	const extractorRegex = new RegExp(`examples\/${config.type}\/`);
	const res = await fetch(
		`https://codeload.github.com/allevo/seqflow-js/tar.gz/${encodeURIComponent(
			config.branch,
		)}`,
	);
	if (!res.ok) {
		console.log(config);
		throw new Error(`Failed to download the template: ${res.statusText}`);
	}
	const tarStream = Readable.fromWeb(
		res.body as import("stream/web").ReadableStream,
	);
	const extractorStream = await tar.x({
		cwd: config.absolutePath,
		strip: 3,
		filter: (p) => extractorRegex.test(p),
	});
	await pipeline(tarStream, extractorStream);

	// Overwrite project name
	const packageJsonPath = path.join(config.absolutePath, "package.json");
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
	packageJson.name = config.projectName;
	packageJson.dependencies["@seqflow/seqflow"] = "*";
	packageJson.dependencies["@seqflow/components"] = "*";

	console.log(JSON.stringify(packageJson, null, 2));

	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

export async function main(args: string[]) {
	const configurationFromCMD = parseArguments(args);
	const config = await collectInformation(configurationFromCMD);

	console.log(`
The project will be created in ${config.absolutePath}
The project name will be ${config.projectName}
The template is ${config.type}

🚀 Creating project...
`);

	await createApp(config);

	console.log(`
Project created successfully!
🎉 Happy coding! 🎉

To start the project, run:
- cd ${config.absolutePath}
- pnpm install
- pnpm start

See documentation at https://seqflow.dev
`);
}

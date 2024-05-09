
declare module '*.md' {
	const toc: { slug: string, title: string, type: 'h2' | 'h3', level: number }[];
	const html: string;

	export { toc, html };
}

declare module '*.svg' {
	const content: (w: number, h: number) => string;
	export default content;
}

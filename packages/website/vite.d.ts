
declare module '*.md' {
	const toc: { slug: string, title: string, type: 'h2' | 'h3' }[];
	const html: string;

	export { toc, html };
}

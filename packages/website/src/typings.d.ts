declare module "*.svg" {
	const content: (width: number, height: number) => string;
	export default content;
}
declare module "*.md" {
	export const html: string;
	export const toc: {
		title: string;
		slug: string;
		type: "h2" | "h3";
		level: number;
	}[];
}

// import { resolve } from "path";
import { defineConfig } from "vite";
// import chokidar from "chokidar";
// import child_process from "child_process";

export default defineConfig({
	root: "src",
	build: {
		outDir: "../dist",
	},
	publicDir: "../public",
});

/*
function myLiveReload() {
	const paths = ["src/**"];
	return {
		name: "my-reload",
		configureServer({ ws, config }) {
			const root = config.root ?? process.cwd();

			function build() {
				child_process.execSync("npm run build", { stdio: "inherit" });
			}

			async function buildAndReload() {
				await build();
				await reload();
			}

			const reload = (path) => {
				ws.send({
					type: "full-reload",
					path: config.alwaysReload ? "*" : path,
				});
				if (config.log ?? true) {
					config.logger.info(`page reload ` + path + root, {
						clear: true,
						timestamp: true,
					});
				}
			};

			chokidar
				.watch(paths, { cwd: root, ignoreInitial: true, ...config })
				.on("add", buildAndReload)
				.on("change", buildAndReload);
		},
	};
}
*/
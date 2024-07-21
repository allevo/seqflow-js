import { spawn, spawnSync } from "node:child_process";
import waitOn from "wait-on";

console.log("STARTING STORYBOOK");

const storybookProcess = spawn("pnpm", ["run", "storybook"], {
	stdio: "inherit",
});
storybookProcess.on("exit", (code) => {
	console.log(`--- Storybook exited with code ${code}`);
});

console.log('AWAITING for a WHILE');
await new Promise((resolve) => setTimeout(resolve, 10_000));

/*
console.log("WAITING FOR STORYBOOK TO START");
try {
	await waitOn({
		resources: ["http://localhost:6006"],
		timeout: 10_000,
	});
} catch (error) {
	console.error("Storybook did not start in time", error);
	process.exit(1);
}


console.log("STARTING STORYBOOK TESTS");
try {
	spawnSync("pnpm", ["test:storybook"], { stdio: "inherit" });
} catch (error) {
	console.error("Storybook tests failed", error);
	process.exit(1);
}
console.log("STORYBOOK TESTS PASSED");
*/

console.log("KILLING STORYBOOK");
storybookProcess.kill();

console.log("SKIPPED");

// Force the process to exit
process.exit(0);

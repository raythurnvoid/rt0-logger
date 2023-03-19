import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [dts()],
	build: {
		lib: {
			entry: [
				"./src/lib/browser.ts",
				"./src/lib/node.ts",
				"./src/lib/types.ts",
				"./src/lib/utils.ts",
			],
			fileName: "index",
			formats: ["es"],
		},
		target: "esnext",
		ssr: true,
		minify: false,
		rollupOptions: {
			output: {
				compact: false,
				preserveModules: true,
			},
		},
	},

	define: {
		"import.meta.vitest": "undefined",
	},

	test: {
		includeSource: ["src/**/*.{js,ts}"],
	},
});

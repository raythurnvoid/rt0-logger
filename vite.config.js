import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	plugins: [dts()],
	build: {
		lib: {
			entry: ['./src/lib/log.ts', './src/lib/colors.ts', './src/lib/utils.ts'],
			formats: ['es']
		},
		target: 'esnext',
		ssr: true,
		minify: false,
		rollupOptions: {
			output: {
				preserveModules: true
			}
		}
	},

	define: {
		'import.meta.vitest': 'undefined'
	},

	test: {
		includeSource: ['src/**/*.{js,ts}']
	}
});

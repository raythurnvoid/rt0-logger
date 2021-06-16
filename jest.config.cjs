const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig.json");

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || [], {
		prefix: "<rootDir>/",
	}),
	testPathIgnorePatterns: ["/node_modules/", "<rootDir>/lib/"],
};

module.exports = config;

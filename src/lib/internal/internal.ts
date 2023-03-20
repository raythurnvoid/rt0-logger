import type {
	Config,
	ConfigFn,
	ConfigurableLogLevel,
	ConsoleLog,
	Level,
	Log as ILog,
	LogConstructor,
} from "../types.js";

export function computeConfig(configFn?: ConfigFn) {
	const config = Object.assign(
		{
			logLevel: "debug",
		},
		configFn?.() ?? {}
	);

	return config;
}

export function buildLoggerClass(
	bindConsoleLog: (level: Level, label?: string) => ConsoleLog
): LogConstructor {
	class Log implements ILog {
		constructor(private label?: string) {}

		get debug(): ConsoleLog {
			return bindConsoleLog("debug", this.label);
		}

		get d() {
			return this.debug;
		}

		get error(): ConsoleLog {
			return bindConsoleLog("error", this.label);
		}

		get e() {
			return this.error;
		}

		get fail(): ConsoleLog {
			return bindConsoleLog("fail", this.label);
		}

		get f() {
			return this.fail;
		}

		get info(): ConsoleLog {
			return bindConsoleLog("info", this.label);
		}

		get i() {
			return this.info;
		}

		get success(): ConsoleLog {
			return bindConsoleLog("success", this.label);
		}

		get s() {
			return this.success;
		}

		get warn(): ConsoleLog {
			return bindConsoleLog("warn", this.label);
		}

		get w() {
			return this.warn;
		}

		get raw(): ConsoleLog {
			return console.log.bind(console);
		}

		get r() {
			return this.raw;
		}

		sub(label: string): Log {
			const subLabel = `${this.label}${label}`;
			return new Log(subLabel);
		}
	}

	return Log;
}

export function createLogBaseArgs(label: string | undefined) {
	const args = [];

	if (label) {
		args.push(`[${label}]`);
	}

	return args;
}

export function getLogLevelValue(logLevel: Level | ConfigurableLogLevel) {
	return logLevels.indexOf(logLevel);
}

export function getConsoleLogFn(level: Level) {
	const consoleLogLevel =
		level === "success" ? "info" : level === "fail" ? "error" : level;

	return console[consoleLogLevel];
}

export function createLogger(
	config: Config,
	level: Level,
	label: string | undefined,
	args: any[]
) {
	let hookResult = config.hook?.({
		args,
		level,
		label,
	}) ?? { args };

	let logger: (...args: any[]) => any;

	if ("logger" in hookResult && hookResult.logger) {
		logger = hookResult.logger;
	} else {
		hookResult = hookResult as { args: any[] };
		logger = getConsoleLogFn(level).bind(console, ...hookResult.args);
	}

	return logger;
}

if (import.meta.vitest) {
	const { it, assert, expect, vi, describe } = import.meta.vitest;

	describe("createLogger", () => {
		it("should return a function that logs to console", () => {
			const spy = vi.spyOn(console, "debug");

			const logger = createLogger(
				{ logLevel: "debug" },
				"debug",
				"test-module.ts",
				["[test-module.ts]", "[DEBUG]"]
			);

			expect(logger).toBeInstanceOf(Function);

			logger("test");
			console.log(logger);

			expect(spy).toHaveBeenCalledWith("[test-module.ts]", "[DEBUG]", "test");
		});

		it("should override the arguments passed to the console with the hook confguration", () => {
			const spy = vi.spyOn(console, "debug");

			const logger = createLogger(
				{
					logLevel: "debug",
					hook: ({ args }) => {
						return {
							args: ["[custom-arg]"],
						};
					},
				},
				"debug",
				"test-module.ts",
				["[test-module.ts]", "[DEBUG]"]
			);

			logger("test");

			expect(spy).toHaveBeenCalledWith("[custom-arg]", "test");
		});

		it("should override the called function with the hook configuration", () => {
			const consoleDebugSpy = vi.spyOn(console, "debug");
			const consoleLogSpy = vi.spyOn(console, "log");
			const customLogger = vi.fn((options: { message: string }) => {
				console.log(options.message);
			});

			const logger = createLogger(
				{
					logLevel: "debug",
					hook: ({ args }) => {
						return {
							logger: (...logArgs: any[]) => {
								const options = {
									message: logArgs.join(" "),
								};
								customLogger(options);
								console.log(...args);
							},
						};
					},
				},
				"debug",
				"test-module.ts",
				["[test-module.ts]", "[DEBUG]"]
			);

			logger("test", "message");

			expect(customLogger).toHaveBeenCalledWith({
				message: "test message",
			});
			expect(consoleLogSpy).toHaveBeenCalledWith("[test-module.ts]", "[DEBUG]");
			expect(consoleDebugSpy).not.toHaveBeenCalled();
		});
	});
}

export const logLevels: (Level | ConfigurableLogLevel)[] = [
	"none",
	"fail",
	"error",
	"warn",
	"success",
	"info",
	"debug",
];

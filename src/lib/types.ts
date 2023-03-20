export interface Log {
	/**
	 * Bind to `console.debug` with the given label.
	 *
	 * @example
	 * ```typescript
	 * log.debug(`Hello World`);
	 * ```
	 * @result
	 * ```shell
	 * [path/to/module.ts] [DEBUG]: Hello World
	 * ```
	 */
	debug: ConsoleLog;
	/**
	 * Alias for `debug`.
	 */
	d: ConsoleLog;

	/**
	 * Bind to `console.error` with the given label.
	 *
	 * @example
	 * ```typescript
	 * log.error(`Hello World`);
	 * ```
	 * @result
	 * ```shell
	 * [path/to/module.ts] [ERROR]: Hello World
	 * ```
	 */
	error: ConsoleLog;
	/**
	 * Alias for `error`.
	 */
	e: ConsoleLog;

	/**
	 * Bind to `console.error` with the given label.
	 *
	 * Will log `[FAIL]` instead of `[ERROR]`.
	 *
	 * @example
	 * ```typescript
	 * log.fail(`Hello World`);
	 * ```
	 * @result
	 * ```shell
	 * [path/to/module.ts] [FAIL]: Hello World
	 * ```
	 */
	fail: ConsoleLog;
	/**
	 * Alias for `fail`.
	 */
	f: ConsoleLog;

	/**
	 * Bind to `console.info` with the given label.
	 *
	 * @example
	 * ```typescript
	 * log.info(`Hello World`);
	 * ```
	 * @result
	 * ```shell
	 * [path/to/module.ts] [INFO]: Hello World
	 * ```
	 */
	info: ConsoleLog;
	/**
	 * Alias for `info`.
	 */
	i: ConsoleLog;

	/**
	 * Bind to `console.info` with the given label.
	 *
	 * Will log `[SUCCESS]` instead of `[INFO]`.
	 *
	 * @example
	 * ```typescript
	 * log.success(`Hello World`);
	 * ```
	 * @result
	 * ```shell
	 * [path/to/module.ts] [SUCCESS]: Hello World
	 * ```
	 */
	success: ConsoleLog;
	/**
	 * Alias for `success`.
	 */
	s: ConsoleLog;

	/**
	 * Bind to `console.warn` with the given label.
	 *
	 * @example
	 * ```typescript
	 * log.warn(`Hello World`);
	 * ```
	 * @result
	 * ```shell
	 * [path/to/module.ts] [WARN]: Hello World
	 * ```
	 */
	warn: ConsoleLog;
	/**
	 * Alias for `warn`.
	 */
	w: ConsoleLog;

	/**
	 * Bind to `console.log`.
	 *
	 * @example
	 * ```typescript
	 * log.raw(`Hello World`);
	 * ```
	 * @result
	 * ```shell
	 * Hello World
	 * ```
	 */
	raw: ConsoleLog;
	/**
	 * Alias for `raw`.
	 */
	r: ConsoleLog;

	/**
	 * Create a new logger with additional context:
	 *
	 * @example
	 * ```typescript
	 * const sub = log.sub(":method");
	 *
	 * log.i("info message");
	 * // [path/to/module.ts:method] [INFO] info message
	 * ```
	 */
	sub(subLogLabel?: string): Log;
}

/**
 * Create a new logger labelled with the given label.
 *
 * @example
 * ```typescript
 * const log = new Log("path/to/module.ts");
 *
 * log.info(`Hello World}`);
 * log.i(`Hello World}`);
 * ```
 */
export type LogConstructor = new (label?: string | undefined) => Log;

export type ConsoleLog = typeof console.log;

/**
 * A function that returns the configuration for the logger.
 */
export type ConfigFn = () => Config;

export interface Config {
	/**
	 * The minimum log level to log.
	 *
	 * The log levels follow this hierarchy: `"debug"`, `"info"`, `"warn"`, `"error"`, `"none"`.
	 *
	 * The defined level will disable all the logs on the left of the hierarchy.
	 *
	 * The default value is `"debug"`.
	 *
	 * @see {@link ConfigurableLogLevel}
	 *
	 * @example
	 * ```typescript
	 * import { buildLogger } from "@raythurnevoid/rt0-logger";
	 *
	 * const Log = buildLogger(() => {
	 *   return {
	 *     logLevel: "info"
	 *   }
	 * });
	 * const log = new Log("my-module");
	 *
	 * log.debug("Hello World");
	 * // Won't be logged
	 *
	 * log.info("Hello World");
	 * // Will be logged
	 * ```
	 */
	logLevel?: ConfigurableLogLevel;

	/**
	 * This function will be called before the log is printed.
	 *
	 * @returns One of the following:
	 * 	- An object with the `args` property to override the arguments passed to the default logger (`console["log" | "info" | "warn" | "error" | "debug"]`).
	 * 	- An object with the `logger` property to override the logger used to print the log.
	 */
	hook?: Hook;
}

export type Hook = (input: HookInput) => HookOutput;

export type HookInput = {
	/**
	 * Arguments that will be used by default to bind the console functions when the hooks doesn't return an object with the `logger` property.
	 *
	 * @example
	 * ```typescript
	 * const log = new Log("my-module");
	 * log.info("Hello", "World");
	 * // args = ["my-module", "[INFO]"]
	 * ```
	 */
	args: any[];
	/**
	 * The log level.
	 *
	 * @example
	 * ```typescript
	 * log.info("Hello World");
	 * // level = "info"
	 * ```
	 */
	level: Level;
	/**
	 * The label of the logger.
	 *
	 * @example
	 * ```typescript
	 * const log = new Log("my-module");
	 * log.info("Hello World");
	 * // label = "my-module"
	 * ```
	 */
	label?: string;
};

export type HookOutput =
	| {
			/**
			 * Arguments that will be used by to bind the console functions.
			 *
			 * @example
			 * ```typescript
			 * import { buildLogger } from "@raythurnevoid/rt0-logger";
			 *
			 * const Log = buildLogger(() => {
			 *  return {
			 * 	hook: (input) => {
			 * 		return {
			 * 			args: ["[custom-arg]"]
			 * 		}
			 * 	}
			 * });
			 * const log = new Log("my-module");
			 *
			 * log.info("Hello World");
			 * // will log: ["[custom-arg]", "Hello World"]
			 * ```
			 */
			args: any[];
	  }
	| {
			/**
			 * The logger that will overwrite the default one.
			 * This function will be called with the arguments set by the user.
			 *
			 * @example
			 * ```typescript
			 * import { buildLogger } from "@raythurnevoid/rt0-logger";
			 *
			 * const Log = buildLogger(() => {
			 *   return {
			 *     logger: (...args) => {
			 *       console.log(args);
			 *     }
			 *   }
			 * });
			 * const log = new Log("my-module");
			 *
			 * log.debug("Hello World");
			 * // args = ["Hello World"]
			 * ```
			 */
			logger: (...args: any[]) => any;
	  };

export type Level = "debug" | "info" | "warn" | "error" | "success" | "fail";

export type ConfigurableLogLevel = "none" | Exclude<Level, "success" | "fail">;

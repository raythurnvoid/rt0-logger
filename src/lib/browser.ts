import {
	buildLoggerClass,
	createLogBaseArgs,
	defaultConfig,
	getLogLevelValue,
} from "./internal/internal.js";
import type { ConfigFn, ILog, Level } from "./types.js";

export function buildLogger(
	configFn: ConfigFn = () => defaultConfig
): new (label: string) => ILog {
	function bindConsoleLog(level: Level, label?: string) {
		const config = configFn();
		const logLevel =
			level === "success" ? "info" : level === "fail" ? "error" : level;

		if (getLogLevelValue(logLevel) > getLogLevelValue(config.logLevel)) {
			return () => undefined;
		}

		const args = createLogBaseArgs(config, label);

		return console[logLevel].bind(console, ...args);
	}

	const Log = buildLoggerClass(bindConsoleLog);

	return Log;
}

export { defaultConfig } from "./internal/internal.js";

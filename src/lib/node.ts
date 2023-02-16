import { colors } from "./internal/colors.js";
import {
	buildLoggerClass,
	createLogBaseArgs,
	createLogger,
	getLogLevelValue,
	computeConfig,
} from "./internal/internal.js";
import type { ConfigFn, ILog, Level } from "./types.js";

export function buildLogger(configFn?: ConfigFn): new (label: string) => ILog {
	function bindConsoleLog(level: Level, label?: string) {
		const config = computeConfig(configFn);

		if (getLogLevelValue(level) > getLogLevelValue(config.logLevel)) {
			return () => undefined;
		}

		let args = createLogBaseArgs(label);
		args.push(colors[level](`[${level.toUpperCase()}]`));

		const logger = createLogger(config, level, label, args);

		return logger;
	}

	const Log = buildLoggerClass(bindConsoleLog);
	return Log;
}

export { c, colors } from "./internal/colors.js";

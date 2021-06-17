import chalk from "chalk";
import {
	buildLoggerClass,
	getColor,
	defaultConfig,
	getLogLevelValue,
} from "./internal.js";
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

		const args = [];
		if (label) {
			args.push(`[${label}]`);
		}
		args.push(chalk[getColor(level)](`[${level.toUpperCase()}]`));
		return console[logLevel].bind(console, ...args);
	}

	const Log = buildLoggerClass(bindConsoleLog);

	return Log;
}

export function getModuleLabel(meta: any) {
	const label = meta.filename.replace(process.cwd(), "").replace(/\\/g, "/");
	return label;
}

export { c, colors, defaultConfig } from "./internal.js";

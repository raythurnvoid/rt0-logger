import type {
	Config,
	ConfigFn,
	ConfigurableLogLevel,
	ConsoleLog,
	ILog,
	Level,
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
): new (label?: string) => ILog {
	const subLogsMap = new Map<string, Log>();

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
			let subLog = subLogsMap.get(subLabel);
			if (!subLog) {
				subLog = new Log(subLabel);
				subLogsMap.set(subLabel, subLog);
			}
			return subLog;
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

	const logger =
		"logger" in hookResult && hookResult.logger
			? hookResult.logger
			: getConsoleLogFn(level).bind(console, ...args);

	return logger;
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

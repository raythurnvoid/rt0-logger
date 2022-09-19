import type { Config, ConsoleLog, ILog, Level } from "../types.js";

export const defaultConfig: Config = {
	logLevel: "debug",
};

export function buildLoggerClass(
	bindConsoleLog: (level: Level, label?: string) => ConsoleLog
): new (label: string) => ILog {
	const subLogsMap = new Map<string, Log>();

	class Log implements ILog {
		constructor(private label: string) {}

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
			const subLabel = `${this.label}/${label}`;
			console.log(subLabel);
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

export function getLogLevelValue(logLevel: string) {
	return logLevels.indexOf(logLevel as Config["logLevel"]);
}

export const logLevels = ["none", "error", "warn", "info", "debug"] as const;

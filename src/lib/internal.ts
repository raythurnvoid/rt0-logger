import chalk from "chalk";
import type { Config, ConsoleLog, ILog, Level } from "./types";

export const defaultConfig: Config = {
	logLevel: "debug",
};

export function buildLoggerClass(
	bindConsoleLog: (level: Level, label?: string) => ConsoleLog
): new (label: string | NodeModule) => ILog {
	class Log implements ILog {
		private label: string;

		constructor(label: string | NodeModule) {
			function isNodeModule(label: string | NodeModule): label is NodeModule {
				return !!(label as NodeModule).filename;
			}

			if (isNodeModule(label)) {
				this.label = label.filename
					.replace(process.cwd(), "")
					.replace(/\\/g, "/");
			} else {
				this.label = label;
			}
		}

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
	}

	return Log;
}

export namespace c {
	export const debug = chalk[getColor("debug")];
	export const d = debug;

	export const info = chalk[getColor("info")];
	export const i = info;

	export const warn = chalk[getColor("warn")];
	export const w = warn;

	export const error = chalk[getColor("error")];
	export const e = error;

	export const success = chalk[getColor("success")];
	export const s = success;

	export const fail = chalk[getColor("fail")];
	export const f = fail;
}

export const colors = c;

export function getColor(level: Level) {
	switch (level) {
		case "debug":
			return "gray";
		case "info":
			return "blue";
		case "warn":
			return "magentaBright";
		case "error":
			return "redBright";
		case "success":
			return "green";
		case "fail":
			return "red";
	}
}

export function getLogLevelValue(logLevel: string) {
	return logLevels.indexOf(logLevel as Config["logLevel"]);
}

export const logLevels = ["none", "error", "warn", "info", "debug"] as const;

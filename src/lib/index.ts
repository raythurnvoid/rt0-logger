import chalk from "chalk";

export const defaultConfig: Config = {
	logLevel: "debug",
};

export interface ILog {
	debug: ConsoleLog;
	d: ConsoleLog;

	error: ConsoleLog;
	e: ConsoleLog;

	fail: ConsoleLog;
	f: ConsoleLog;

	info: ConsoleLog;
	i: ConsoleLog;

	success: ConsoleLog;
	s: ConsoleLog;

	warn: ConsoleLog;
	w: ConsoleLog;

	raw: ConsoleLog;
	r: ConsoleLog;
}

export function buildLogger(
	configFn: ConfigFn = () => defaultConfig
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

function getColor(level: Level) {
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

function getLogLevelValue(logLevel: string) {
	return logLevels.indexOf(logLevel as Config["logLevel"]);
}

type Level = "debug" | "info" | "warn" | "error" | "success" | "fail";
type ConsoleLog = typeof console.log;

export interface Config {
	logLevel: typeof logLevels[number];
}

type ConfigFn = () => Config;

const logLevels = ["none", "error", "warn", "info", "debug"] as const;

import chalk from "chalk";

export class Log {
	constructor(private label: string) {}

	get debug(): ConsoleLog {
		return bindConsoleLog("debug", this.label);
	}

	d(...args: ConsoleLogParams) {
		return this.debug(...args);
	}

	get error(): ConsoleLog {
		return bindConsoleLog("error", this.label);
	}

	e(...args: ConsoleLogParams) {
		return this.error(...args);
	}

	get fail(): ConsoleLog {
		return bindConsoleLog("fail", this.label);
	}

	f(...args: ConsoleLogParams) {
		return this.fail(...args);
	}

	get info(): ConsoleLog {
		return bindConsoleLog("info", this.label);
	}

	i(...args: ConsoleLogParams) {
		return this.info(...args);
	}

	get success(): ConsoleLog {
		return bindConsoleLog("success", this.label);
	}

	s(...args: ConsoleLogParams) {
		return this.success(...args);
	}

	get warn(): ConsoleLog {
		return bindConsoleLog("warn", this.label);
	}

	w(...args: ConsoleLogParams) {
		return this.warn(...args);
	}

	get raw(): ConsoleLog {
		return console.log.bind(console);
	}

	r(...args: ConsoleLogParams) {
		return this.raw(...args);
	}
}

function bindConsoleLog(level: Level, label?: string) {
	const logLevel =
		level === "success" ? "info" : level === "fail" ? "error" : level;
	const args = [];
	if (label) {
		args.push(`[${label}]`);
	}
	args.push(chalk[getColor(level)](`[${level.toUpperCase()}]`));
	return console[logLevel].bind(console, ...args);
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

	return undefined!;
}

type Level = "debug" | "info" | "warn" | "error" | "log" | "success" | "fail";
type ConsoleLog = typeof console.log;
type ConsoleLogParams = Parameters<typeof console.log>;

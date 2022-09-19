import type { logLevels } from "./internal/internal.js";

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

	sub(subLogLabel: string): ILog;
}

export type ConsoleLog = typeof console.log;

export type ConfigFn = () => Config;

export interface Config {
	logLevel: typeof logLevels[number];
	prefix?: () => string;
}

export type Level = "debug" | "info" | "warn" | "error" | "success" | "fail";

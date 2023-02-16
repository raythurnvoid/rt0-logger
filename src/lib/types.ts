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

	sub(subLogLabel?: string): ILog;
}

export type ConsoleLog = typeof console.log;

export type ConfigFn = () => Config;

export interface Config {
	logLevel?: ConfigurableLogLevel;
	hook?: (input: { args: any[]; level: Level; label?: string }) =>
		| {
				args: any[];
		  }
		| { logger: (...args: any[]) => any };
}

export type Level = "debug" | "info" | "warn" | "error" | "success" | "fail";

export type ConfigurableLogLevel = "none" | Exclude<Level, "success" | "fail">;

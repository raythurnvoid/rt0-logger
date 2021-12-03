import chalk from "chalk";
import type { Level } from "../types.js";

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

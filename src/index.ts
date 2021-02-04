import chalk from "chalk";
import type { ForegroundColor } from "chalk";

export function createLog(label: string): typeof log;
export function createLog(module: NodeModule): typeof log;
export function createLog(label: any): typeof log {
	if ((label as NodeModule).filename) {
		label = (label as NodeModule).filename.split(/\\|\//).slice(-1);
	}

	function labelledLog(
		level: Level,
		message: string,
		...args: any[]
	): typeof console["log"];
	function labelledLog(message: string, ...args: any[]): typeof console["log"];
	function labelledLog(...args: any[]): typeof console["log"] {
		let res = getLevel(...args);
		const level = res.level;
		args = res.args;

		const color = getColor(level);

		const tempMessage = getMessage(...args);
		let message = tempMessage.message;
		args = tempMessage.args;

		message = `[${label}] ${
			message ? (color ? chalk[color](message) : message) : ""
		}`;

		return log(level, message, ...args);
	}

	return labelledLog;
}

export function log(
	level: Level,
	message: string,
	...args: any[]
): typeof console["log"];
export function log(message: string, ...args: any[]): typeof console["log"];
export function log(...args: any[]): typeof console["log"] {
	let tempLevel = getLevel(...args);
	let level = tempLevel.level;
	args = tempLevel.args;

	const color = getColor(level);

	const tempMessage = getMessage(...args);
	let message = tempMessage.message;
	args = tempMessage.args;

	message =
		`${level.toUpperCase()}` + message
			? ` ${color ? chalk[color](message) : message}`
			: "";

	level = level === "success" ? "info" : level === "fail" ? "error" : level;

	return console[level].bind(console, message, ...args);
}

function getLevel(...args: any[]) {
	let level: Level;
	if (
		typeof args[0] !== "string" ||
		!["debug", "info", "warn", "error", "log", "success", "fail"].includes(
			args[0]
		)
	) {
		level = "log";
	} else {
		level = args[0] as Level;
		args = args.slice(1);
	}

	return { level, args };
}

function getMessage(...args: any[]) {
	let message: string;
	if (typeof args[0] === "string") {
		message = args[0];
		args = args.slice(1);
	}

	return { message, args };
}

function getColor(level: Level): typeof ForegroundColor {
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

type Level = "debug" | "info" | "warn" | "error" | "log" | "success" | "fail";
interface LogOptions {
	level?: Level;
	label?: string;
	message?: string;
	args: any[];
}

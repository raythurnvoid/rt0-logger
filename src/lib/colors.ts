import chalk from 'chalk';
import type { LogLevelTag } from './log.js';

/**
 * An object providing colors for different log levels using `chalk`.
 *
 * @example
 * ```
 * import { colors } from '@raythurnevoid/rt0-logger/colors';
 *
 * console.log(colors.info('This is an info message.'));
 * ```
 *
 * @example
 * ```
 * //  Create a logger factory to log colored messages.
 *
 * import { colors } from '@raythurnevoid/rt0-logger/colors';
 * import { Log, convertLevelTagToLogLevel } from '@raythurnevoid/rt0-logger';
 *
 * const log = new Log(label, {
 *   customLogger: ({ label, levelTag, callerArgs }) => {
 *     const level = convertLevelTagToLogLevel(levelTag);
 *     console[level](colors[levelTag](`[${levelTag}] [${label}]`), ...callerArgs);
 *   }
 * });
 *
 * log.i(colors.info('test')); // [info] [test/module] test
 * ```
 */
const colors: {
	[K in LogLevelTag]: (...text: string[]) => string;
} = {
	trace: chalk.gray.bind(chalk),
	debug: chalk.gray.bind(chalk),
	info: chalk.blue.bind(chalk),
	warn: chalk.yellow.bind(chalk),
	error: chalk.redBright.bind(chalk),
	success: chalk.green.bind(chalk),
	fail: chalk.red.bind(chalk)
};

export { colors };

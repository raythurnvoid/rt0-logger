/**
 * The available log levels.
 */
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error';

/**
 * The available log level tags that will be showed in the console.
 * It provides additional tags for success and fail.
 */
export type LogLevelTag = LogLevel | 'success' | 'fail';

const logLevelsOrder: LogLevel[] = ['trace', 'debug', 'info', 'warn', 'error'];

/**
 * Available Log options.
 */
export type LogOptions =
	| {
			/**
			 * @returns The log level to use.
			 *
			 * @example
			 * ```
			 * //  Define the log level to use.
			 *
			 * import { Log } from '@raythurnevoid/rt0-logger';
			 *
			 * const log = new Log('test/module', {
			 *   getLogLevel: () => 'info'
			 * });
			 *
			 * log.d('test'); // won't log anything
			 * log.i('test'); // [info] [test/module] test
			 * ```
			 */
			getLogLevel: () => LogLevel;
	  }
	| {
			/**
			 * A custom logger to use instead of the default logger.
			 *
			 * @example
			 * ```
			 * //  Create a logger to log messages with timestamps.
			 *
			 * import { Log, checkIfShouldLog, convertLevelTagToLogLevel } from '@raythurnevoid/rt0-logger';
			 *
			 * const log = new Log('test/module', {
			 *   customLogger: ({ label, levelTag, callerArgs }) => {
			 *     if (!checkIfShouldLog('info', levelTag)) return;
			 *
			 *     const dateTime = new Date().toISOString().replace('T', ' ').replace('Z', '');
			 *     const level = convertLevelTagToLogLevel(levelTag);
			 *     console[level](`[${dateTime}] [${levelTag}] [${label}]`, ...callerArgs);
			 *   }
			 * });
			 *
			 * log.d('test'); // won't log anything
			 * log.i('test'); // [2021-08-01 12:00:00] [info] [test/module] test
			 * ```
			 *
			 * @example
			 * ```
			 * //  Create a logger factory to log colored messages with timestamps.
			 *
			 * import { colors } from './lib/colors.js';
			 * import { Log, checkIfShouldLog, convertLevelTagToLogLevel } from './lib/log.js';
			 *
			 * function createLogger(label: string) {
			 *   return new Log(label, {
			 *     customLogger: ({ label, levelTag, callerArgs }) => {
			 *       if (!checkIfShouldLog('debug', levelTag)) return;
			 *
			 *       const dateTime = new Date().toISOString().replace('T', ' ').replace('Z', '');
			 *       const level = convertLevelTagToLogLevel(levelTag);
			 *       console[level](colors[levelTag](`[${dateTime}] [${levelTag}] [${label}]`), ...callerArgs);
			 *     }
			 *   });
			 * }
			 *
			 * const log: Log = createLogger('test/module');
			 *
			 * log.d(colors.debug('test')); // [2021-08-01 12:00:00] [debug] [test/module] test
			 * ```
			 */
			customLogger: Logger;
	  };

/**
 * A class for logging messages.
 */
export class Log {
	private logger = (input: LoggerInput) =>
		defaultLogger({ ...input, configuredLogLevel: this.getLogLevel() });
	private getLogLevel = () => 'trace' as LogLevel;

	/**
	 * Creates a new log instance with the specified label.
	 *
	 * @param label The label for this log instance.
	 * @param customLogger An optional custom logger to use instead of the default logger.
	 *
	 * @example
	 * ```
	 * import { Log } from '@raythurnevoid/rt0-logger';
	 *
	 * const log = new Log('test/module');
	 *
	 * log.d('test'); // [debug] [test/module] test
	 * ```
	 */
	constructor(private label: string, options?: LogOptions) {
		if (options && 'customLogger' in options) {
			this.logger = options?.customLogger;
		}

		if (options && 'getLogLevel' in options) {
			this.getLogLevel = options.getLogLevel;
		}
	}

	/**
	 * Logs a trace message.
	 *
	 * @param args The arguments to log.
	 */
	t(...args: any[]) {
		this.logger({
			levelTag: 'trace',
			label: this.label,
			callerArgs: args
		});
	}

	/**
	 * Logs a debug message.
	 *
	 * @param args The arguments to log.
	 */
	d(...args: any[]) {
		this.logger({
			levelTag: 'debug',
			label: this.label,
			callerArgs: args
		});
	}

	/**
	 * Logs an info message.
	 *
	 * @param args The arguments to log.
	 */
	i(...args: any[]) {
		this.logger({
			levelTag: 'info',
			label: this.label,
			callerArgs: args
		});
	}

	/**
	 * Logs a success message.
	 *
	 * @param args The arguments to log.
	 */
	s(...args: any[]) {
		this.logger({
			levelTag: 'success',
			label: this.label,
			callerArgs: args
		});
	}

	/**
	 * Logs a fail message.
	 *
	 * @param args The arguments to log.
	 */
	f(...args: any[]) {
		this.logger({
			levelTag: 'fail',
			label: this.label,
			callerArgs: args
		});
	}

	/**
	 * Logs a warning message.
	 *
	 * @param args The arguments to log.
	 */
	w(...args: any[]) {
		this.logger({
			levelTag: 'warn',
			label: this.label,
			callerArgs: args
		});
	}

	/**
	 * Logs an error message.
	 *
	 * @param args The arguments to log.
	 */
	e(...args: any[]) {
		this.logger({
			levelTag: 'error',
			label: this.label,
			callerArgs: args
		});
	}
}

if (import.meta.vitest) {
	const { it, describe, expect, vi } = import.meta.vitest;

	describe('Log', () => {
		it('should log a message with the correct arguments', () => {
			const loggerSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

			const log = new Log('test');
			log.i('hello');

			expect(loggerSpy).toHaveBeenCalledWith('[info] [test]', 'hello');
		});

		it('should log a message with the correct arguments when using a custom logger', () => {
			const loggerSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
			const customLogger: Logger = (input: {
				levelTag: LogLevelTag;
				label: string;
				callerArgs: any[];
			}) => {
				console.info('custom logger', input.levelTag, input.label, ...input.callerArgs);
			};

			const log = new Log('test', { customLogger });
			log.i('hello');

			expect(loggerSpy).toHaveBeenCalledWith('custom logger', 'info', 'test', 'hello');
		});
	});
}

/**
 * Logs an error message.
 *
 * @param args The arguments to log.
 *
 * @example
 * ```
 * const logLevel = convertLevelTagToLogLevel('debug');
 * console[logLevel]('This is a debug message.');
 * ```
 */
export function convertLevelTagToLogLevel(levelTag: LogLevelTag): LogLevel {
	switch (levelTag) {
		case 'success':
		case 'fail':
			return 'info' as const;
		default:
			return levelTag;
	}
}

/**
 * The input for a {@link Logger}.
 */
export type LoggerInput = { levelTag: LogLevelTag; label: string; callerArgs: any[] };

/**
 * A function that logs a message.
 */
export type Logger = (input: LoggerInput) => void;

export function checkIfShouldLog(configuredLogLebel: LogLevel, levelTag: LogLevelTag) {
	const level = convertLevelTagToLogLevel(levelTag);
	return logLevelsOrder.indexOf(level) >= logLevelsOrder.indexOf(configuredLogLebel);
}

function defaultLogger(
	input: LoggerInput & {
		configuredLogLevel: LogLevel;
	}
) {
	if (!checkIfShouldLog(input.configuredLogLevel, input.levelTag)) return;
	const level = convertLevelTagToLogLevel(input.levelTag);
	console[level](`[${input.levelTag}] [${input.label}]`, ...input.callerArgs);
}

if (import.meta.vitest) {
	const { it, describe, expect, vi } = import.meta.vitest;

	describe('defaultLogger', () => {
		const input = {
			levelTag: 'info' as LogLevelTag,
			label: 'test',
			callerArgs: ['hello'],
			configuredLogLevel: 'info' as LogLevel
		};

		it('should call console.info with correct arguments', () => {
			const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

			defaultLogger(input);

			expect(consoleSpy).toHaveBeenCalledWith('[info] [test]', 'hello');
		});

		it('should not call console.info if logging level is below set logLevel', () => {
			const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

			defaultLogger({
				levelTag: 'info',
				label: 'test',
				callerArgs: ['hello'],
				configuredLogLevel: 'warn' as LogLevel
			});

			expect(consoleSpy).not.toHaveBeenCalled();
		});
	});
}

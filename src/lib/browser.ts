import {
	buildLoggerClass,
	createLogBaseArgs,
	createLogger,
	getLogLevelValue,
	computeConfig
} from './internal/internal.js';
import type { ConfigFn, Level, LogConstructor } from './types.js';

/**
 * Create a new logger constructor.
 */
export function buildLogger(
	/**
	 * A function that returns the configuration for the logger.
	 *
	 * The configuration can be changed on the fly by mutating the returned object.
	 */
	configFn?: ConfigFn
): LogConstructor {
	function bindConsoleLog(level: Level, label?: string) {
		const config = computeConfig(configFn);

		if (getLogLevelValue(level) > getLogLevelValue(config.logLevel)) {
			return () => undefined;
		}

		let args = createLogBaseArgs(label);
		args.push(`[${level.toUpperCase()}]`);

		const logger = createLogger(config, level, label, args);

		return logger;
	}

	const Log = buildLoggerClass(bindConsoleLog);

	return Log;
}

if (import.meta.vitest) {
	const { it, assert, expect, vi, describe } = import.meta.vitest;

	describe('test browser logger', () => {
		const Log = buildLogger();
		assert.ok(Log);
		const log = new Log('browser.test.ts');
		assert.ok(log);

		assert.doesNotThrow(() => {
			log.debug('test');
			log.d('test');
			log.error('test');
			log.e('test');
			log.fail('test');
			log.f('test');
			log.info('test');
			log.i('test');
			log.success('test');
			log.s('test');
			log.warn('test');
			log.w('test');
			log.raw('test');
			log.r('test');
		});

		it('test sub log', () => {
			const sublog = log.sub(':sub');
			assert.ok(sublog);

			assert.doesNotThrow(() => {
				sublog.debug('sub test');
			});

			assert.deepStrictEqual(sublog, log.sub(':sub'));
		});

		it('test prefix', () => {
			const Log = buildLogger(() => ({
				logLevel: 'debug',
				prefix: () => `[${new Date().toISOString()}]`
			}));

			const log = new Log('test-prefix');

			assert.ok(log);

			assert.doesNotThrow(() => {
				log.debug('prefix test');
			});
		});
	});

	it('configFn should be called once', () => {
		const configFn = vi.fn((() => {
			return {
				logLevel: 'none'
			};
		}) as ConfigFn);

		const Log = buildLogger(configFn);
		const log = new Log('browser.test.ts');

		expect(configFn).toHaveBeenCalledTimes(0);
		log.debug('test');
		expect(configFn).toHaveBeenCalledTimes(1);
	});

	describe('test logLevel config', () => {
		const configFn = vi.fn((() => {
			return {
				logLevel: 'none'
			};
		}) as ConfigFn);

		const Log = buildLogger(configFn);
		const log = new Log('browser.test.ts');

		it('when logLevel is none console should not be called', () => {
			const spy = vi.spyOn(console, 'debug');
			log.debug('test');
			expect(spy).toHaveBeenCalledTimes(0);
		});

		it('when logLevel is debug console should be called', () => {
			const spy = vi.spyOn(console, 'debug');
			configFn.mockReturnValueOnce({ logLevel: 'debug' });
			log.debug('test');
			expect(spy).toHaveBeenCalledTimes(1);
		});
	});

	describe('test custom logger', () => {
		const loggerMock = vi.fn((...args: any[]) => {});
		const Log = buildLogger(() => ({
			hook: () => {
				return { logger: loggerMock };
			}
		}));
		const log = new Log('browser.test.ts');

		it('when custom logger is provided, it should be called', () => {
			expect(loggerMock).toHaveBeenCalledTimes(0);
			log.debug('test');
			expect(loggerMock).toHaveBeenCalledTimes(1);
		});

		it("when custom logger is provided, console logger shouldn't be called", () => {
			const spy = vi.spyOn(console, 'debug');
			log.debug('test');
			expect(spy).toHaveBeenCalledTimes(0);
		});
	});

	describe('buildLogger', () => {
		it('should override arguments when args is returned in the hook configuration', () => {
			const spy = vi.spyOn(console, 'info');

			const Log = buildLogger(() => ({
				hook: ({ args }) => {
					expect(args).toEqual(['[browser.test.ts]', '[INFO]']);
					return { args: ['[custom-arg]'] };
				}
			}));

			const log = new Log('browser.test.ts');
			log.info('test');

			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenCalledWith('[custom-arg]', 'test');
		});
	});
}

import { colors } from './lib/colors.js';
import { Log, checkIfShouldLog, convertLevelTagToLogLevel, type LogLevel } from './lib/log.js';

const logLevel: LogLevel = 'info';

function createLogger(label: string) {
	return new Log(label, {
		customLogger: ({ label, levelTag, callerArgs }) => {
			if (!checkIfShouldLog(logLevel, levelTag)) return;

			const dateTime = new Date().toISOString().replace('T', ' ').replace('Z', '');
			const level = convertLevelTagToLogLevel(levelTag);
			console[level](colors[levelTag](`[${dateTime}] [${levelTag}] [${label}]`, ...callerArgs));
		}
	});
}

const log: Log = createLogger('test/module');

log.i('test'); // [2021-08-01 12:00:00] [debug] [test/module] test

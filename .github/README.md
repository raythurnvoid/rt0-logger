A customizable logger library for Browser and NodeJS.

## Features

- Simple and easy-to-use API
- Log level filtering
- Custom logger support
- Works with both Browser and NodeJS

## Installation

```bash
npm install rt0-logger
```

## Basic Usage

```typescript
import { Log } from 'rt0-logger';

const log = new Log('test/module');

log.d('test'); // [debug] [test/module] test
```

## Set Log Level

```typescript
import { Log, type LogLevel } from 'rt0-logger';

const logLevel: LogLevel = 'info';

function createLogger(label: string) {
  return new Log(label, {
    getLogLevel: () => logLevel
  });
}

const log: Log = createLogger('test/module');

log.d('test'); // won't log anything
log.i('test'); // [info] [test/module] test
```

## Advanced Usage

### Custom Logger with Timestamps

```typescript
import { Log, checkIfShouldLog, convertLevelTagToLogLevel, type LogLevel } from 'rt0-logger';

const logLevel: LogLevel = 'info';

function createLogger(label: string) {
  return new Log('test/module', {
    customLogger: ({ label, levelTag, callerArgs }) => {
      if (!checkIfShouldLog(logLevel, levelTag)) return;

      const dateTime = new Date().toISOString().replace('T', ' ').replace('Z', '');
      const level = convertLevelTagToLogLevel(levelTag);
      console[level](`[${dateTime}] [${levelTag}] [${label}]`, ...callerArgs);
    }
  });
}

const log: Log = createLogger('test/module');

log.d('test'); // won't log anything
log.i('test'); // [2021-08-01 12:00:00] [info] [test/module] test
```

### Custom Logger with Colored Messages

```typescript
import { colors } from 'rt0-logger/colors';
import { Log, checkIfShouldLog, convertLevelTagToLogLevel, type LogLevel } from 'rt0-logger';

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
```

## License

MIT

#### README provided by GPT-4 🚀 (with some changes here and there)

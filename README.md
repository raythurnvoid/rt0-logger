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

Check the [GitHub homepage](https://github.com/raythurnevoid/rt0-logger) for the complete documentation.

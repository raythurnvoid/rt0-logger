[Installation](#installation)

[Usage](#usage)

[Configuration](#configuration)

[Colors](#colors)

[Errors Stack Traces with Cause](#errors)

<a name="installation" />

# Installation

`npm i @raythurnevoid/rt0-logger`

<a name="usage" />

# Usage

1. Create a `log.ts` file:

```typescript
import { buildLogger } from '@raythurnevoid/rt0-logger/browser.js';
import type { Config } from '@raythurnevoid/rt0-logger/types.js';

const config: Config = {
  logLevel: 'debug'
};

export const Log = buildLogger(() => config);

export type Log = InstanceType<typeof Log>;
```

2. Use your new logger:

```typescript
import { Log } from './log.js';

const log = new Log('path/to/module.ts');

log.info(`Hello World}`);
log.i(`Hello World}`);
```

Results:

```shell
[path/to/module.ts] [INFO] Hello World
[path/to/module.ts] [INFO] Hello World
```

## Log levels

You can use any of these methods to log:

```typescript
log.info('info message');
log.i('info message');
// [path/to/module.ts] [INFO] info message

log.debug('debug message');
log.d('debug message');
// [path/to/module.ts] [DEBUG] debug message

log.warn('warn message');
log.w('warn message');
// [path/to/module.ts] [WARN] warn message

log.error('error message');
log.e('error message');
// [path/to/module.ts] [ERROR] error message

log.fail('fail message');
log.f('fail message');
// [path/to/module.ts] [FAIL] fail message

log.success('success message');
log.s('success message');
// [path/to/module.ts] [SUCCESS] success message

log.raw('raw message');
log.r('raw message');
// raw message
```

## Sub loggers

You can also create a new logger with additional context:

```typescript
const sub = log.sub(':method');

log.i('info message');
// [path/to/module.ts:method] [INFO] info message
```

<a name="configuration" />

# `buildLogger` configuration

`buildLogger`accept an optional function in input that should return a configuration object with the following optional properties:

## `logLevel?`

Type: `"debug" | "info" | "warn" | "error" | "none"`

The minimum log level to log.

The log levels follow this hierarchy: `"debug"`, `"info"`, `"warn"`, `"error"`, `"none"`.

The defined level will disable all the logs on the left of the hierarchy.

The default value is `"debug"`.

### Example

```typescript
import { buildLogger } from '@raythurnevoid/rt0-logger';
const Log = buildLogger(() => {
  return {
    logLevel: 'info'
  };
});
const log = new Log('my-module');
log.debug('Hello World');
// Won't be logged
log.info('Hello World');
// Will be logged
```

## `hook?`

This function will be called before the log is printed.

it must return one of the following:

- An object with the `args` property to override the arguments passed to the default logger (`console["log" | "info" | "warn" | "error" | "debug"]`).
- An object with the `logger` property to override the logger used to print the log.

### `hook` function input

- `args: any[]`

  Arguments that will be used by default to bind the console functions when the hooks doesn't return an object with the `logger` property.

  ```typescript
  const log = new Log('my-module');
  log.info('Hello', 'World');
  // args = ["my-module", "[INFO]"]
  ```

- `level: "debug" | "info" | "warn" | "error" | "success" | "fail"`

  The log level.

  ```typescript
  log.info('Hello World');
  // level = "info"
  ```

- `label?: string`

  The label of the logger.

  ```typescript
  const log = new Log('my-module');
  log.info('Hello World');
  // label = "my-module"
  ```

### `hook` function return

The `hook` function can return one of the following:

- `args: any[]`

  Arguments that will be used by to bind the console functions.

  ```typescript
  import { buildLogger } from "@raythurnevoid/rt0-logger";
  const Log = buildLogger(() => {
  return {
    hook: () => {
      return {
        args: ["[custom-arg]"]
      }
    }
  });
  const log = new Log("my-module");
  log.info("Hello World");
  // will log: ["[custom-arg]", "Hello World"]
  ```

- `logger: (...args: any[]) => any`

  The logger that will overwrite the default one.

  This function will be called with the arguments set by the user.

  ```typescript
  import { buildLogger } from '@raythurnevoid/rt0-logger';
  const Log = buildLogger(() => {
    return {
      hook: () => {
        return {
          logger: (...args) => {
            // The args are ["Hello", "World"]
            console.log('custom logger');
          }
        };
      }
    };
  });
  const log = new Log('my-module');
  log.info('Hello', 'World');
  // will log: "custom logger"
  ```

<a name="colors" />

# Colors

**rt0-logger** can colorize your log levels using `chalk` by replacing `@raythurnevoid/rt0-logger/browser.js` with `@raythurnevoid/rt0-logger/node`:

```typescript
import { buildLogger } from '@raythurnevoid/rt0-logger/node.js';
```

Colors don't make sense in browser environment and will just increase the size of your bundle.

The colors used by this package are exported in the `@raythurnevoid/rt0-logger/colors.js` module.

<a name="errors"/>

# Log errors including cause in the stack trace

```typescript
import { Log } from './log.js';
import { getErrorStackWithCause } from '@raythurnevoid/rt0-logger/utils.js';

const log = new Log('path/to/module.ts');

try {
  throw new Error('Failed to do things');
} catch (e) {
  try {
    throw new Error('Failed to handle error');
  } catch (e) {
    const error = new Error('Scary error', {
      cause: e as Error
    });

    log.e(getErrorStackWithCause(error));
  }
}
```

Result:

```text
[path/to/module.ts] [ERROR] Error: Scary error
    at Object.<anonymous> (path/to/module.ts:11:11)
Caused by: Error: Failed to handle error
    at Object.<anonymous> (path/to/module.ts:8:11)
Caused by: Error: Failed to do things
    at Object.<anonymous> (path/to/module.ts:5:11)
```

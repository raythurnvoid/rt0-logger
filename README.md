1. Create a `log.ts` file:

```typescript
import { buildLogger } from "@raythurnevoid/rt0-logger/browser.js";
import type { Config } from "@raythurnevoid/rt0-logger/types.js";

const config: Config = {
	logLevel: "debug",
};

export const Log = buildLogger(() => config);

export type Log = InstanceType<typeof Log>;
```

2. Use your new logger:

```typescript
import { Log } from "./log.js";

const log = new Log("path/to/module.ts");

log.info(`Hello World}`);
log.i(`Hello World}`);
```

Results:

```shell
[path/to/module.ts] [INFO] Hello World
[path/to/module.ts] [INFO] Hello World
```

Check the [GitHub homepage](https://github.com/raythurnevoid/rt0-logger) for the complete documentation.

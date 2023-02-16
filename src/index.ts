import { buildLogger, c, colors } from "./lib/node.js";

const Log = buildLogger(() => {
	return {
		logLevel: "debug",
		hook(input) {
			return { args: ["[test]", ...input.args] };
		},
	};
});
const log = new Log("test/module");

log.debug(colors.debug("test"));
log.d(c.d("test"));
log.error(colors.error("test"));
log.e(c.e("test"));
log.fail(colors.fail("test"));
log.f(c.f("test"));
log.info(colors.info("test"));
log.i(c.i("test"));
log.success(colors.success("test"));
log.s(c.s("test"));
log.warn(colors.warn("test"));
log.w(c.w("test"));
log.raw("test");
log.r("test");

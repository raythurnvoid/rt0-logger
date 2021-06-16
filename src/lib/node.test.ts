import { buildLogger, colors, c } from "./node";
import type { ConfigFn } from "./types";

test("test node logger", () => {
	const Log = buildLogger();
	expect(Log).toBeTruthy();
	const log = new Log(module);
	expect(log).toBeTruthy();

	expect(() => {
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
	}).not.toThrow();
});

test("test config", () => {
	const configFn = jest.fn((() => {
		return {
			logLevel: "none",
		};
	}) as ConfigFn);

	const Log = buildLogger(configFn);
	const log = new Log(module);
	expect(configFn.mock.calls.length).toStrictEqual(0);
	log.debug(colors.debug("test"));
	expect(configFn.mock.calls.length).toStrictEqual(1);
});

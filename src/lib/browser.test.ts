import { buildLogger } from "./browser.js";
import type { ConfigFn } from "./types.js";

test("test node logger", () => {
	const Log = buildLogger();
	expect(Log).toBeTruthy();
	const log = new Log("browser.test.ts");
	expect(log).toBeTruthy();

	expect(() => {
		log.debug("test");
		log.d("test");
		log.error("test");
		log.e("test");
		log.fail("test");
		log.f("test");
		log.info("test");
		log.i("test");
		log.success("test");
		log.s("test");
		log.warn("test");
		log.w("test");
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
	const log = new Log("browser.test.ts");
	expect(configFn.mock.calls.length).toStrictEqual(0);
	log.debug("test");
	expect(configFn.mock.calls.length).toStrictEqual(1);
});

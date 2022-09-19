import assert from "node:assert";
import test from "node:test";
import { buildLogger } from "./browser.js";
import type { ConfigFn } from "./types.js";
import sinon from "sinon";

test("test browser logger", () => {
	const Log = buildLogger();
	assert.ok(Log);
	const log = new Log("browser.test.ts");
	assert.ok(log);

	assert.doesNotThrow(() => {
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
	});

	test("test sub log", () => {
		const sublog = log.sub(":sub");
		assert.ok(sublog);

		assert.doesNotThrow(() => {
			sublog.debug("sub test");
		});

		assert.deepStrictEqual(sublog, log.sub(":sub"));
	});
});

test("test config", () => {
	const configFn = sinon.fake((() => {
		return {
			logLevel: "none",
		};
	}) as ConfigFn);

	const Log = buildLogger(configFn);
	const log = new Log("browser.test.ts");
	assert.strictEqual(configFn.callCount, 0);
	log.debug("test");
	assert.strictEqual(configFn.callCount, 1);
});

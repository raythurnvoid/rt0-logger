import assert from "node:assert";
import test from "node:test";
import { resolve } from "node:path";
import { buildLogger, colors, c, getModuleLabel } from "./node.js";
import type { ConfigFn } from "./types.js";
import sinon from "sinon";

test("test node logger", () => {
	const Log = buildLogger();
	assert.ok(Log);
	const log = new Log(getModuleLabel(import.meta));
	assert.ok(log);

	assert.doesNotThrow(() => {
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
	});

	test("test sub log", () => {
		const sublog = log.sub(":sub");
		assert.ok(sublog);

		assert.doesNotThrow(() => {
			sublog.debug(colors.debug("sub test"));
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
	const log = new Log(getModuleLabel(import.meta));
	assert.strictEqual(configFn.callCount, 0);
	log.debug(colors.debug("test"));
	assert.strictEqual(configFn.callCount, 1);
});

test("test getModuleLabel handle esm module urls", () => {
	const root = resolve(".");

	assert.strictEqual(
		getModuleLabel({
			url: `file:///${root.replaceAll("\\", "/")}/src/lib/node.test.ts`,
		}),
		"src/lib/node.test.ts"
	);
});

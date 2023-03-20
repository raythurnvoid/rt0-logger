/**
 * Get the stack trace from an error and its cause recursively.
 */
export function getErrorStackWithCause(error: Error): string {
	let stack = error.stack ?? "";

	if (error.cause) {
		stack += `\nCaused by: ${
			(error.cause as Error)?.stack
				? getErrorStackWithCause(error.cause as Error)
				: error.cause
		}`;
	}

	return stack;
}

if (import.meta.vitest) {
	const { it, describe, expect } = import.meta.vitest;

	describe("getErrorStackWithCause", () => {
		it("should return stack with cause", () => {
			const error = new Error("error", {
				cause: new Error("cause", {
					cause: new Error("real cause"),
				}),
			});
			const stack = getErrorStackWithCause(error);
			expect(stack).toContain("Caused by: Error: cause");
			expect(stack).toContain("Caused by: Error: real cause");
		});
	});
}

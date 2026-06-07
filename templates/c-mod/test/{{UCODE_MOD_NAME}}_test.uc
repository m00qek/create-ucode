import { describe, it, assert } from 'utest';
import { add, multiply } from '{{UCODE_MOD_NAME}}';

describe("add()", () => {
	it("returns the sum of two numbers", () => {
		assert.match(5, add(2, 3));
	});

	it("handles negative numbers", () => {
		assert.match(-1, add(2, -3));
	});

	it("throws type error on non-integer arguments", () => {
		let threw = false;
		try {
			add("foo", 3);
		} catch (e) {
			threw = true;
		}
		assert.match(true, threw);
	});
});

describe("multiply()", () => {
	it("returns the product of two numbers", () => {
		assert.match(6, multiply(2, 3));
	});

	it("returns zero when multiplying by zero", () => {
		assert.match(0, multiply(5, 0));
	});

	it("handles negative multipliers", () => {
		assert.match(-6, multiply(2, -3));
		assert.match(6, multiply(-2, -3));
	});
});

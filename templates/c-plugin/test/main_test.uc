import { describe, it, assert } from 'utest';
import { add, multiply } from 'main';

describe("add()", () => {
	it("returns the sum of two numbers", () => {
		assert.match(5, add(2, 3));
	});

	it("handles negative numbers", () => {
		assert.match(-1, add(2, -3));
	});
});

describe("multiply()", () => {
	it("returns the product of two numbers", () => {
		assert.match(6, multiply(2, 3));
	});

	it("returns zero when multiplying by zero", () => {
		assert.match(0, multiply(5, 0));
	});
});

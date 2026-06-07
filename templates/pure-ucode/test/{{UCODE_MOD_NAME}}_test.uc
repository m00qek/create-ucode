import { describe, it, assert } from 'utest';
import { add } from '{{UCODE_MOD_NAME}}';

describe("add()", () => {
	it("returns the sum of two numbers", () => {
		assert.match(5, add(2, 3));
	});

	it("handles negative numbers", () => {
		assert.match(-1, add(2, -3));
	});
});

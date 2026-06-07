'use strict';
import { add as c_add } from '{{UCODE_MOD_NAME}}.native';

export function add(a, b) {
	return c_add(a, b);
};

export function multiply(a, b) {
	let result = 0;
	const absB = b < 0 ? -b : b;
	for (let i = 0; i < absB; i++)
		result = c_add(result, a);
	return b < 0 ? -result : result;
};

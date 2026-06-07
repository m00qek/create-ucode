'use strict';
import { add as c_add } from '{{PKG_NAME}}.native';

export function add(a, b) {
	return c_add(a, b);
};

export function multiply(a, b) {
	let result = 0;
	for (let i = 0; i < b; i++)
		result = c_add(result, a);
	return result;
};

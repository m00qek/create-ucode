'use strict';
import { add as c_add } from '{{PKG_NAME}}.native';

export function add(a, b) {
	return c_add(a, b);
};

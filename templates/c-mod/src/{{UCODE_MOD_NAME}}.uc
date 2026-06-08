'use strict';
import { add } from '{{UCODE_MOD_NAME}}.native';

export function calculate(deps) {
	const a = int(deps.uci.get('{{PKG_NAME}}', 'main', 'a') ?? '2');
	const b = int(deps.uci.get('{{PKG_NAME}}', 'main', 'b') ?? '3');
	return `The sum of ${a} + ${b} is ${add(a, b)}`;
};

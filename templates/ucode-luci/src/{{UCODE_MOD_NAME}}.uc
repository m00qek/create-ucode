'use strict';

export function greet(deps) {
	const name = deps.uci.get('{{PKG_NAME}}', 'main', 'name') ?? 'World';
	return `Hello ${name}!`;
};

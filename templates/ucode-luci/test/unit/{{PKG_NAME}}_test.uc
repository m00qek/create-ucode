import { describe, it, assert, mock } from 'utest';
import { greet } from '{{PKG_NAME}}';

describe('greet()', () => {
	it('greets by name', () => {
		let config = { {{PKG_NAME}}: { main: { '.type': 'settings', name: 'Alice' } } };
		mock.inject('uci', { data: config }, (uci) => {
			assert.match('Hello Alice!', greet({ uci: uci.cursor() }));
		});
	});

	it('falls back to World when name is not configured', () => {
		mock.inject('uci', { data: {} }, (uci) => {
			assert.match('Hello World!', greet({ uci: uci.cursor() }));
		});
	});
});

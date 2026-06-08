import { describe, it, assert, mock } from 'utest';
import { calculate } from '{{UCODE_MOD_NAME}}';

describe('calculate()', () => {
	it('returns the sum from UCI config', () => {
		let config = { "{{PKG_NAME}}": { main: { '.type': 'settings', a: '2', b: '3' } } };
		mock.inject('uci', { data: config }, (uci) => {
			assert.match('The sum of 2 + 3 is 5', calculate({ uci: uci.cursor() }));
		});
	});

	it('uses defaults when config is missing', () => {
		mock.inject('uci', { data: {} }, (uci) => {
			assert.match('The sum of 2 + 3 is 5', calculate({ uci: uci.cursor() }));
		});
	});
});

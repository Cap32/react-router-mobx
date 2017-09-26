
import { setQueryString } from '../index';
import * as qs from '../queryString';
import * as thirdPartyQS from 'qs';

describe('query', () => {
	test('should built-in parse work', () => {
		expect(qs.parse('hello=world')).toEqual({ hello: 'world' });
	});

	test('should built-in stringify work', () => {
		expect(qs.stringify({ hello: 'world' })).toBe('hello=world');
	});

	test('should setQueryString() work', () => {
		const parse = jest.fn(thirdPartyQS.parse);
		const stringify = jest.fn(thirdPartyQS.stringify);
		setQueryString({ parse, stringify });
		expect(qs.stringify({ hello: 'world' })).toBe('hello=world');
		expect(qs.parse('hello=world')).toEqual({ hello: 'world' });
		expect(parse.mock.calls.length).toBe(1);
		expect(stringify.mock.calls.length).toBe(1);
	});
});

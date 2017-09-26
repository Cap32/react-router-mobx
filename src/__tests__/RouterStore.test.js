
import { RouterStore } from '../index';
import { isObservable, autorun } from 'mobx';
import url from 'url';

describe('RouterStore', () => {
	let routerStore;
	let history;

	beforeEach(() => {
		const location = {
			pathname: '/',
			search: '?hello=world',
			hash: '',
		};
		let updateFn = () => {};
		routerStore = new RouterStore();
		history = {
			push: jest.fn((loc) => {
				if (typeof loc === 'string') { loc = url.parse(loc); }
				loc.search = loc.search || '';
				loc.hash = loc.hash || '';
				loc.pathname = loc.pathname || '/';
				updateFn(loc);
			}),
			replace: jest.fn(),
			listen: jest.fn((update) => {
				updateFn = update;
			}),
		};

		autorun(() => {
			routerStore.__initial({ history, location });
		});
	});

	test('should push and replace be function', () => {
		expect(typeof routerStore.history.push).toBe('function');
		expect(typeof routerStore.history.replace).toBe('function');
		expect(typeof routerStore.push).toBe('function');
		expect(typeof routerStore.replace).toBe('function');
	});

	test('should location observable', () => {
		expect(isObservable(routerStore.location, 'pathname')).toBe(true);
		expect(isObservable(routerStore.location, 'search')).toBe(true);
		expect(isObservable(routerStore.location, 'hash')).toBe(true);
	});

	test('should routerStore.location.hash work', () => {
		expect(history.push.mock.calls.length).toBe(0);
		routerStore.location.hash = '#hello';
		expect(routerStore.location.hash).toBe('#hello');
		expect(history.push.mock.calls.length).toBe(1);
	});

	test('should routerStore.location.search work', () => {
		expect(history.push.mock.calls.length).toBe(0);
		routerStore.location.search = '?foo=bar';
		expect(routerStore.location.search).toBe('?foo=bar');
		expect(history.push.mock.calls.length).toBe(1);
	});

	test('should routerStore.location.pathname work', () => {
		expect(history.push.mock.calls.length).toBe(0);
		routerStore.location.pathname = '/hello';
		expect(routerStore.location.pathname).toBe('/hello');
		expect(history.push.mock.calls.length).toBe(1);
	});

	test('should routerStore.location.query work', () => {
		expect(history.push.mock.calls.length).toBe(0);
		routerStore.location.query = {
			...routerStore.location.query,
			foo: 'bar',
		};
		expect(routerStore.location.query).toEqual({
			foo: 'bar',
			hello: 'world',
		});
		expect(history.push.mock.calls.length).toBe(1);
	});

	test('should update routerStore.location work', () => {
		expect(history.push.mock.calls.length).toBe(0);
		routerStore.location = '/a';
		expect(routerStore.location.pathname).toBe('/a');
		expect(history.push.mock.calls.length).toBe(1);
	});

	test('should push work', () => {
		expect(history.push.mock.calls.length).toBe(0);
		routerStore.push({ query: { hello: 'world' } });
		expect(routerStore.location.query).toEqual({ hello: 'world' });
		expect(history.push.mock.calls.length).toBe(1);
	});

	test('should replace work', () => {
		expect(history.replace.mock.calls.length).toBe(0);
		routerStore.replace('/');
		expect(history.replace.mock.calls.length).toBe(1);
	});
});

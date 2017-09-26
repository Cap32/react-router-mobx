
import { RouterStore } from '../index';
import { isObservable, autorun } from 'mobx';
import url from 'url';

describe('RouterStore', () => {
	test('should routerStore work', () => {
		const routerStore = new RouterStore();
		const location = {
			pathname: '/',
			search: '?hello=world',
			hash: '',
		};
		const history = {
			push: jest.fn((loc) => {
				if (typeof loc === 'string') { loc = url.parse(loc); }
				history._updateFn(loc);
			}),
			replace: jest.fn(),
			listen: jest.fn((update) => {
				history._updateFn = update;
			}),
		};

		autorun(() => {
			routerStore.__initial({ history, location });
		});

		expect(typeof routerStore.history.push).toBe('function');
		expect(typeof routerStore.history.replace).toBe('function');
		expect(typeof routerStore.push).toBe('function');
		expect(typeof routerStore.replace).toBe('function');
		expect(isObservable(routerStore, '_location')).toBe(true);
		expect(isObservable(routerStore.location, 'pathname')).toBe(true);
		expect(isObservable(routerStore.location, 'search')).toBe(true);
		expect(isObservable(routerStore.location, 'hash')).toBe(true);
		expect(routerStore.location.query).toEqual({ hello: 'world' });

		expect(history.push.mock.calls.length).toBe(0);
		routerStore.location = '/a';
		expect(routerStore.location.pathname).toBe('/a');
		expect(history.push.mock.calls.length).toBe(1);

		routerStore.location.pathname = '/b';
		expect(routerStore.location.pathname).toBe('/b');
		expect(history.push.mock.calls.length).toBe(2);

		routerStore.location.query = {
			...routerStore.location.query,
			foo: 'bar',
		};
		expect(routerStore.location.query).toEqual({ foo: 'bar' });
		expect(history.push.mock.calls.length).toBe(3);

		routerStore.location.hash = '#hello';
		expect(routerStore.location.hash).toBe('#hello');
		expect(history.push.mock.calls.length).toBe(4);

		routerStore.location.search = '?hello=world';
		expect(routerStore.location.search).toBe('?hello=world');
		expect(history.push.mock.calls.length).toBe(5);

		routerStore.location.state = { hello: 'world' };
		expect(routerStore.location.state).toEqual({ hello: 'world' });
		expect(history.push.mock.calls.length).toBe(6);

		routerStore.push({ query: { hello: 'world' } });
		expect(routerStore.location.query).toEqual({ hello: 'world' });
		expect(history.push.mock.calls.length).toBe(7);

		expect(history.replace.mock.calls.length).toBe(0);
		routerStore.replace('/');
		expect(history.replace.mock.calls.length).toBe(1);
	});
});

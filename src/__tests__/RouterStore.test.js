
import { RouterStore } from '../index';
import { isObservable, autorun } from 'mobx';

describe('RouterStore', () => {
	it('should routerStore work', () => {
		const routerStore = new RouterStore();
		const match = {
			path: '/',
			url: '/',
			params: {},
			isExact: true,
		};
		const location = {
			pathname: '/',
			search: '?hello=world',
			hash: '',
		};
		const history = {
			push: jest.fn(),
			replace: jest.fn(),
			listen: jest.fn(),
		};
		autorun(() => {
			routerStore.__initial({ match, history, location });
		});

		expect(typeof routerStore.history.push).toBe('function');
		expect(typeof routerStore.history.replace).toBe('function');
		expect(typeof routerStore.push).toBe('function');
		expect(typeof routerStore.replace).toBe('function');
		expect(isObservable(routerStore, 'match')).toBe(true);
		expect(isObservable(routerStore, '_location')).toBe(true);
		expect(isObservable(routerStore.location, 'pathname')).toBe(true);
		expect(isObservable(routerStore.location, 'search')).toBe(true);
		expect(isObservable(routerStore.location, 'hash')).toBe(true);
		expect(routerStore.match).toEqual(match);
		expect(routerStore.location.query).toEqual({ hello: 'world' });

		expect(history.push.mock.calls.length).toBe(0);
		routerStore.location = '/a';
		expect(history.push.mock.calls.length).toBe(1);
		routerStore.location.pathname = '/b';
		expect(history.push.mock.calls.length).toBe(2);
	});
});

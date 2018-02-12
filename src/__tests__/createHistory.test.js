import { extendObservable } from 'mobx';
import createHistory from '../createHistory';
import Location from '../Location';

describe('createHistory', () => {
	test('should listen() work', () => {
		const listeners = [];
		const originalListen = (listener) => {
			listeners.push(listener);
		};
		const originalHistory = { listen: originalListen };
		const wrapper = {};
		extendObservable(wrapper, {
			_location: {},
		});
		const history = createHistory(wrapper, originalHistory);
		wrapper._location = new Location(wrapper, {
			pathname: 'foo',
		});

		const mockListener = jest.fn();
		history.listen(mockListener);

		for (const listener of listeners) {
			const newLocation = { pathname: 'bar' };
			listener(newLocation);
		}

		expect(mockListener).toBeCalled();
		const calledArgs = mockListener.mock.calls[0];
		expect(calledArgs[0].pathname).toBe('bar');
		expect(calledArgs[1].pathname).toBe('foo');
	});

	test('should removeListener() work', () => {
		const listeners = [];
		const originalListen = (listener) => {
			listeners.push(listener);
		};
		const originalHistory = { listen: originalListen };
		const wrapper = {};
		extendObservable(wrapper, {
			_location: {},
		});
		const history = createHistory(wrapper, originalHistory);
		wrapper._location = new Location(wrapper, {
			pathname: 'foo',
		});

		const mockListener = jest.fn();
		const removeListener = history.listen(mockListener);

		for (const listener of listeners) {
			const newLocation = { pathname: 'bar' };
			listener(newLocation);
		}

		expect(mockListener).toBeCalled();
		removeListener();

		for (const listener of listeners) {
			const newLocation = { pathname: 'bar' };
			listener(newLocation);
		}

		expect(mockListener).toHaveBeenCalledTimes(1);
	});
});

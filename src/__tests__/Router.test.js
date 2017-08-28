
import React from 'react';
import { mount, shallow } from 'enzyme';
import Router from '../Router';
import { MemoryRouter } from 'react-router';

describe('Router', () => {
	it('should component work', () => {
		const CustomRouter = () => null;
		const wrapper = shallow(
			<Router component={CustomRouter} routerStore={{}}>
				<span />
			</Router>
		);
		expect(wrapper.is(CustomRouter)).toBe(true);
	});

	it('should initial routerStore', (done) => {
		const routerStore = {
			__initial(props) {
				const { location, history, match } = props;
				expect(location).toMatchObject({
					pathname: '/',
					search: '',
					hash: '',
				});
				expect(match).toEqual({
					path: '/',
					url: '/',
					params: {},
					isExact: true,
				});
				expect(typeof history.push).toBe('function');
				expect(typeof history.replace).toBe('function');
				expect(history.location).toMatchObject({
					pathname: '/',
					search: '',
					hash: '',
				});
				done();
			}
		};

		mount(
			<Router component={MemoryRouter} routerStore={routerStore}>
				<span />
			</Router>
		);
	});
});

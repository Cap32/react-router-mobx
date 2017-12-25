
import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import { Router } from '../index';
import { MemoryRouter } from 'react-router-dom';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

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
				const { location, history } = props;
				expect(location).toMatchObject({
					pathname: '/',
					search: '',
					hash: '',
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

/* eslint react/prop-types: 0 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { configure, mount } from 'enzyme';
import { Router, RouterStore } from '../index';
import { MemoryRouter, Route } from 'react-router-dom';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('integration ', () => {
	it('location props', () => {
		const routerStore = new RouterStore();
		const render = jest.fn();
		class Foo extends Component {
			render() {
				const { pathname, search } = this.props;
				render(pathname, search);
				return null;
			}
		}

		@observer
		class Bar extends Component {
			componentDidMount() {
				routerStore.push('/foo?bar=baz');
			}

			render() {
				const { pathname, search } = routerStore.location;
				return <Foo pathname={pathname} search={search} />;
			}
		}

		mount(
			<Router component={MemoryRouter} routerStore={routerStore}>
				<Route path="*" component={Bar} />
			</Router>,
		);

		expect(render).toHaveBeenNthCalledWith(1, '/', '');
		expect(render).toHaveBeenNthCalledWith(2, '/foo', '?bar=baz');
	});
});

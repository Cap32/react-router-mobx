
import React from 'react';
import jsdom from 'jsdom';
import { mount } from 'enzyme';
// import lib from '../src';

beforeEach(() => {
	global.document = jsdom.jsdom(
		'<!doctype html><html><body></body></html>'
	);
	if (typeof window === 'undefined') {
		global.window = global.document.defaultView;
		global.navigator = global.window.navigator;
	}
});

test('task', function () {
	const text = 'hello world';
	const wrapper = mount(<div>{text}</div>);
	expect(wrapper.find('div').text()).toBe(text);
});

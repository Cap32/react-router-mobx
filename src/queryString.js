
import * as qs from 'tiny-querystring';

const queryString = {
	stringify: qs.stringify,
	parse: qs.parse,
};

export function stringify(object) {
	return queryString.stringify(object);
}

export function parse(search) {
	return queryString.parse(search);
}

export function setQueryString(customQueryString) {
	return Object.assign(queryString, customQueryString);
}

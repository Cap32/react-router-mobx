
import qs from 'qs';

const queryString = {
	stringify: (query) => qs.stringify(query, { addQueryPrefix: true }),
	parse: (search) => qs.parse(search, { ignoreQueryPrefix: true }),
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

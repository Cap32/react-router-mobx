
import qs from 'qs';

export function stringify(object) {
	return qs.stringify(object, { addQueryPrefix: true });
}

export function parse(search) {
	return qs.parse(search, { ignoreQueryPrefix: true });
}

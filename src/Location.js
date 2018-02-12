import { observable, computed } from 'mobx';
import { parse, stringify } from './queryString';

export default class Location {
	@observable _search = '';
	@observable _hash = '';
	@observable _pathname = '';
	@observable state = {};

	@computed
	get query() {
		return parse(this._search.slice(1));
	}
	set query(query) {
		const queryString = stringify(query);
		this.search = queryString && `?${queryString}`;
		return true;
	}

	@computed
	get search() {
		return this._search;
	}
	set search(search) {
		this._wrapper.push({ search });
		return true;
	}

	@computed
	get hash() {
		return this._hash;
	}
	set hash(hash) {
		this._wrapper.push({ hash });
		return true;
	}

	@computed
	get pathname() {
		return this._pathname;
	}
	set pathname(pathname) {
		this._wrapper.push({ pathname });
		return true;
	}

	constructor(wrapper, loc) {
		this._wrapper = wrapper;
		this._search = loc.search;
		this._path = loc.path;
		this._hash = loc.hash;
		this._state = loc.state;
	}
}

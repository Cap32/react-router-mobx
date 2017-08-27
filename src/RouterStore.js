
import { observable, computed } from 'mobx';
import { parse, stringify } from './queryString';

const stripQuery = (loc) => {
	if (loc.query) {
		const { search, query, ...other } = loc;
		return {
			...other,
			search: stringify(query),
		};
	}
	return loc;
};

class LocationData {
	@observable pathname = '/';
	@observable search = '?';
	@observable hash = '';
	@observable state = {};
}

class LocationStore {
	constructor(routerStore, location, history) {
		this.__routerStore = routerStore;
		this._data = new LocationData();

		const update = (loc) => {
			Object.assign(this._data, loc);
		};

		update(location);
		history.listen(update);
	}

	@computed get pathname() {
		return this._data.pathname;
	}
	set pathname(pathname) {
		this.__routerStore.push({ pathname });
		return pathname;
	}

	@computed get search() {
		return this._data.search;
	}
	set search(search) {
		this.__routerStore.push({ search });
		return search;
	}

	@computed get hash() {
		return this._data.hash;
	}
	set hash(hash) {
		this.__routerStore.push({ hash });
		return hash;
	}

	@computed get state() {
		return this._data.state;
	}
	set state(state) {
		this.__routerStore.push({ state });
		return state;
	}

	@computed get query() {
		return parse(this._data.search);
	}
	set query(query) {
		this.search = stringify(query);
		return query;
	}
}

export default class RouterStore {
	@observable _location = { query: {} };
	@observable match = {};

	@computed get location() {
		return this._location;
	}
	set location(loc) {
		this.push(loc);
	}

	__initial({ location, history, match }) {
		this.match = match;
		this._location = observable(new LocationStore(this, location, history));
		this.history = history;
	}

	__setMatch(match) {
		this.match = match;
	}

	push(loc, state) {
		return this.history.push(stripQuery(loc), state);
	}

	replace(loc, state) {
		return this.history.replace(stripQuery(loc), state);
	}
}

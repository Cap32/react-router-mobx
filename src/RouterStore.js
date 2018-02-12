import { observable, computed } from 'mobx';
import Location from './Location';
import { stringify } from './queryString';

const stripQuery = (loc) => {
	if (loc.query) {
		const { search, query, ...other } = loc;
		const queryString = stringify(query);
		return {
			...other,
			search: queryString && `?${queryString}`,
		};
	}
	return loc;
};

export default class RouterStore {
	@observable _location = {};

	@computed
	get location() {
		return this._location;
	}
	set location(location) {
		this.push(location);
		return true;
	}

	__initial({ location, history }) {
		this.history = history;
		this._location = new Location(this, location);

		history.listen((location) => {
			this._location._pathname = location.pathname;
			this._location._search = location.search;
			this._location._hash = location.hash;
		});
	}

	push(loc, state) {
		return this.history.push(stripQuery(loc), state);
	}

	replace(loc, state) {
		return this.history.replace(stripQuery(loc), state);
	}
}

import { observable, computed } from 'mobx';
import Location from './Location';
import createHistory from './createHistory';
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
		this.history = createHistory(this, history);
		this._location = new Location(this, location);
	}

	push(loc, state) {
		return this.history.push(stripQuery(loc), state);
	}

	replace(loc, state) {
		return this.history.replace(stripQuery(loc), state);
	}
}

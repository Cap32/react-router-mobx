import { observable, computed } from 'mobx';
import { parse, stringify } from './queryString';

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
		class Loc {
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

		this.history = history;
		this._location = new Loc(this, location);

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

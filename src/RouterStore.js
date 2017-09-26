
import { observable, computed, autorun, extendObservable } from 'mobx';
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
	_prevLoc = {};

	@observable location = {};

	__initial({ location, history }) {
		class Loc {
			@computed get query() {
				return parse(this.search.slice(1));
			}
			set query(query) {
				const queryString = stringify(query);
				this.search = queryString && `?${queryString}`;
				return query;
			}

			constructor(loc) {
				extendObservable(this, loc);
			}
		}

		this.location = new Loc(location);
		this._prevLoc = location;

		this.history = history;

		history.listen((location) => {
			if (typeof this.location === 'string') {
				this.location = new Loc({});
			}
			this.location.pathname = location.pathname;
			this.location.search = location.search;
			this.location.hash = location.hash;
			this._prevLoc = location;
		});

		autorun(() => {
			if (typeof this.location === 'string' ||
				this.location.search !== this._prevLoc.search ||
				this.location.hash !== this._prevLoc.hash ||
				this.location.pathname !== this._prevLoc.pathname
			) {
				this.push(this.location);
			}
		});
	}

	push(loc, state) {
		return this.history.push(stripQuery(loc), state);
	}

	replace(loc, state) {
		return this.history.replace(stripQuery(loc), state);
	}
}

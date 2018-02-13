export default function createHistory(wrapper, history) {
	const listen = history.listen.bind(history);
	const listeners = [];
	listen((location, action) => {
		const { _location } = wrapper;
		const prevLocation = {
			pathname: _location._pathname,
			search: _location._search,
			hash: _location._hash,
		};
		_location._pathname = location.pathname;
		_location._search = location.search;
		_location._hash = location.hash;
		for (const listener of listeners) {
			listener(_location, prevLocation, action);
		}
	});
	history.listen = function listen(listener) {
		listeners.push(listener);
		return function removeListener() {
			const index = listeners.indexOf(listener);

			/* istanbul ignore else */
			if (index >= 0) {
				listeners.splice(index, 1);
			}
		};
	};
	return history;
}

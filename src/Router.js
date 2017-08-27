
import PropTypes from 'prop-types';
import React, { Component, Children } from 'react';
import { withRouter, Router as ReactRouter } from 'react-router';

@withRouter
class RouterMobX extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
		routerStore: PropTypes.object.isRequired,
		match: PropTypes.object.isRequired,
		history: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
	};

	componentWillMount() {
		this.props.routerStore.__initial(this.props);
	}

	componentWillReceiveProps({ match }) {
		if (this.props.match !== match) {
			this.props.routerStore.__setMatch(match);
		}
	}

	render() {
		return Children.only(this.props.children);
	}
}

export default function Router({
	component: RouterComp,
	children,
	routerStore,
	...other,
}) {
	return (
		<RouterComp {...other}>
			<RouterMobX routerStore={routerStore}>
				{Children.only(children)}
			</RouterMobX>
		</RouterComp>
	);
}

Router.propTypes = {
	children: PropTypes.node.isRequired,
	component: PropTypes.func.isRequired,
	routerStore: PropTypes.object.isRequired,
};

Router.defaultProps = {
	component: ReactRouter,
};

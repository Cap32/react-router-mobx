# react-router-mobx

React Router meets MobX


## WTF

If you wanna push url from `http://aweso.me/search?q=hello&page=4` to `http://aweso.me/search?q=hello&page=5`, you may need:

##### Before

```js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import qs from 'qs';
import myStore from './stores/myStore';

@withRouter
@observer
export default class MyApp extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  goToNextPage = (ev) => {
    ev.preventDefault();
    const { location, history } = this.props;
    const query = qs.parse(location.search ? location.search.slice(1) : '');
    history.push({
      ...location,
      search: '?' + qs.stringify({
        ...query,
        page: 1 + query.page,
      }),
    });
  };

  render() {
    const { location } = this.props;
    const { page } = qs.parse(location.search ? location.search.slice(1) : '');
    return (
      <div>
        <div>{myStore.someContent}</div>
        <p>Page: {page || 1}</p>
        <button onClick={this.goToNextPage}>Next</button>
      </div>
    );
  }
}
```

##### After

```js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import myStore from './stores/myStore';
import routerStore from './stores/routerStore';

@observer
export default class MyApp extends Component {
  goToNextPage = (ev) => {
    ev.preventDefault();
    const { location } = routerStore;
    location.query = {
      ...location.query,
      page: 1 + location.query.page,
    };
  };

  render() {
    const { page } = routerStore.location.query;
    return (
      <div>
        <div>{myStore.someContent}</div>
        <p>Page: {page || 1}</p>
        <button onClick={this.goToNextPage}>Next</button>
      </div>
    );
  }
}
```


## Installation

```bash
yarn add react-router-mobx
```

You should install all the peer dependencies if you haven't installed them:

```bash
yarn add react mobx mobx-react react-router-dom
```

If you are using React Native, please install `react-router-native` instead of `react-router-dom`.


## Usage

1. Use react-router-mobx `Router` instead of react-router `Router`
2. Pass a `RouterStore` instance and react-router `Router` component to `Router` component:

```js
import React, { Component } from 'react';
import { Router, RouterStore } from 'react-router-mobx';
import { BrowserRouter, Route } from 'react-router-dom';

const routerStore = new RouterStore();

export default class App extends Component {
  render() {
    return (
      <Router component={BrowserRouter} routerStore={routerStore}>
        <Route {...someRouteConfigs} />
      </Router>
    );
  }
}
```


## License

MIT

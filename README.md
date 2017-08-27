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

@withRouter
@observer
export default class MyApp extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  goToNextPage = (ev) => {
    ev.preventDefault();
    const { location, history } = this;
    const query = qs.parse(location.search ? location.search.slice(1) : '');
    history.push({
      ...location,
      search: '?' + qs.stringify({
        ...query,
        page: ++query.page,
      }),
    });
  };

  render() {
    const { location } = this;
    const { page } = qs.parse(location.search ? location.search.slice(1) : '');
    return (
      <div>
        <div>Some data...</div>
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
import { routerStore } from 'react-router-mobx';
import { observer } from 'mobx-react';

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
        <div>Some data...</div>
        <p>Page: {page || 1}</p>
        <button onClick={this.goToNextPage}>Next</button>
      </div>
    );
  }
}
```


## License

MIT

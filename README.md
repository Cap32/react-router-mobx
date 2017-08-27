# react-router-mobx

React Router meets MobX


## WTF

If you wanna push url from `http://aweso.me/search?q=hello&page=4` to `http://aweso.me/search?q=hello&page=5`, you may need:

##### Before

```js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import qs from 'qs';

@withRouter
@inject('myStore')
@observer
export default class MyApp extends Component {
  static propTypes = {
    myStore: PropTypes.object.isRequired,
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
    const { location, myStore } = this.props;
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
import { observer, inject } from 'mobx-react';

@inject('myStore', 'routerStore')
@observer
export default class MyApp extends Component {
  static propTypes = {
    myStore: PropTypes.object.isRequired,
    routerStore: PropTypes.object.isRequired,
  };

  goToNextPage = (ev) => {
    ev.preventDefault();
    const { location } = this.props.routerStore;
    location.query = {
      ...location.query,
      page: 1 + location.query.page,
    };
  };

  render() {
    const { routerStore, myStore } = this.props;
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


## License

MIT

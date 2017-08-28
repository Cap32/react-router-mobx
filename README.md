# react-router-mobx

[![Build Status](https://travis-ci.org/Cap32/react-router-mobx.svg?branch=master)](https://travis-ci.org/Cap32/react-router-mobx) [![License](https://img.shields.io/badge/license-MIT_License-blue.svg?style=flat)](https://github.com/Cap32/react-router-mobx/blob/master/LICENSE.md)

React Router meets MobX

## Table of Contents

<!-- MarkdownTOC autolink="true" bracket="round" -->

- [Features](#features)
- [WTF](#wtf)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  - [RouterStore](#routerstore)
  - [Router](#router)
  - [setQueryString\(queryString\)](#setquerystringquerystring)
- [License](#license)

<!-- /MarkdownTOC -->


## Features

- `location` and `match` are observable
- Built-in `query` object to `location`
- Super easy to push/update new URL, pathname, hash, search or query


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


## API Reference

### RouterStore

The MobX store class that contains some router properties and methods.

###### RouterStore#location

A little bits like react-router `location` object which contains `key`, `pathname`, `search`, `hash`, `state`. But there are several differences:

- Prividing `query` object, just like react-router v3 or below
- All properties are observable and mutable
- Could push URL by passing new location or properties, just like `window.location`
  + Push a new URL: `routerStore.location = '/foo?say=hello'`
  + Push a new `pathname`, i.e. from `/foo?say=hello` to `/bar?say=hello`: `routerStore.location.pathname = '/bar'`
  + Push a new `search`, i.e. from `/foo?say=hello` to `/foo?say=world`: `routerStore.location.query = { say: 'world' }` or `routerStore.location.search = '?say=world'`

###### RouterStore#match

Just like react-router `match` object, but it is observable and mutable.

###### RouterStore#history

Just like react-router `history` object.


### Router

The low-level api router component instead of react-router `Router` component.

###### Props

- routerStore (RouterStore): Defining a `RouterStore` instance to store or update `location` and `match` state
- component (ReactComponent): Defining the react router component, e.g. `BrowserRouter`, `MemoryRouter`, `NativeRouter`, etc. Defaults to react-router `Router` component
- history (Object): You can also define a custom history object, just like react-router `Router` component
- All properties in react-router `Router` are supported

### setQueryString(queryString)

Setting a custom `queryString` library.

###### Arguments

1. queryString (Object): Custom `queryString` library, which should contain `parse(object)` and `stringify(object)` methods


## License

MIT

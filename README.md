<!-- Generated from README.hbs using jsdoc2md -->

# react-async-await

Async component that waits on promises to resolve!

## Motivation

Creating a promise is a synchronous action. If you hold a reference to a promise, you can eventually get the future value that it resolves to. Calling `setState` asynchronously in a component can cause a lot of headaches because of race conditions. The promise could still be in a pending state when the component unmounts or the props change. The `Async` component allows you to never worry about these race conditions and enables you to write your asynchronous react code as if it was synchronous.

## Install

```
yarn add react-async-await react
```

<a name="module_ReactAsyncAwait"></a>

## ReactAsyncAwait

* [ReactAsyncAwait](#module_ReactAsyncAwait)
  * [~Async](#module_ReactAsyncAwait..Async) ⇒ <code>ReactElement</code>
  * [~createLoader(loader, [resolver])](#module_ReactAsyncAwait..createLoader) ⇒ <code>ReactComponent</code>

<a name="module_ReactAsyncAwait..Async"></a>

### ReactAsyncAwait~Async ⇒ <code>ReactElement</code>

Component that takes a promise and injects the render callback with the resolved value.

**Kind**: inner property of [<code>ReactAsyncAwait</code>](#module_ReactAsyncAwait)  
**Extends**: <code>ReactComponent</code>

| Param            | Type                  | Description                               |
| ---------------- | --------------------- | ----------------------------------------- |
| props            | <code>object</code>   |                                           |
| [props.await]    | <code>\*</code>       |                                           |
| [props.waiting]  | <code>function</code> | map promise to value                      |
| [props.then]     | <code>function</code> | map result to value                       |
| [props.catch]    | <code>function</code> | map error to value (default throws error) |
| [props.children] | <code>function</code> | render callback                           |

**Example**

```js
import React from "react";
import ReactDOM from "react-dom";
import { Async } from "react-async-await";

class LoadUser extends React.Component {
  componentWillMount() {
    this.setState({
      error: undefined,
      promise: undefined
    });
  }

  componentDidMount() {
    this.setState({
      promise: fetch(`/api/users/${this.props.id}`).then(r => r.json())
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      this.setState({
        error: undefined,
        promise: fetch(`/api/users/${nextProps.id}`).then(r => r.json())
      });
    }
  }

  componentDidCatch(error) {
    this.setState({ error });
  }

  render() {
    return this.state.error ? (
      <div>Uncaught promise rejection: {this.state.error.message}</div>
    ) : (
      <Async await={this.state.promise}>{this.props.children}</Async>
    );
  }
}

ReactDOM.render(
  <LoadUser id={1}>
    {user =>
      typeof user === undefined ? (
        <div>Loading...</div>
      ) : (
        <h1>Hello {user.name}!</h1>
      )
    }
  </LoadUser>,
  document.getElementById("root")
);
```

<a name="module_ReactAsyncAwait..createLoader"></a>

### ReactAsyncAwait~createLoader(loader, [resolver]) ⇒ <code>ReactComponent</code>

Create a wrapper component around `Async` that maps props to a promise when the component mounts.

**Kind**: inner method of [<code>ReactAsyncAwait</code>](#module_ReactAsyncAwait)

| Param      | Type                  | Description                    |
| ---------- | --------------------- | ------------------------------ |
| loader     | <code>function</code> | loader maps props to a promise |
| [resolver] | <code>function</code> | resolver maps props to a key   |

**Example**

```js
import React from "react";
import ReactDOM from "react-dom";
import { createLoader } from "react-async-await";

const LoadUser = createLoader(
  props => fetch(`/api/users/${props.id}`).then(r => r.json()),
  props => props.id // when key changes the loader is called again
);

ReactDOM.render(
  <LoadUser id={1}>
    {user =>
      typeof user === undefined ? (
        <div>Loading...</div>
      ) : (
        <h1>Hello {user.name}!</h1>
      )
    }
  </LoadUser>,
  document.getElementById("root")
);
```

**Example** _(memoized loader)_

```js
import React from "react";
import ReactDOM from "react-dom";
import { createLoader } from "react-async-await";
// https://lodash.com/docs/4.17.5#memoize
import memoize from "lodash/memoize";

const loader = memoize(
  props => fetch(`/api/users/${props.id}`).then(r => r.json()),
  props => props.id // key is used to resolve to cached value
);

const LoadUser = createLoader(
  loader,
  props => props.id // when key changes the loader is called again
);

ReactDOM.render(
  <LoadUser id={1}>
    {user =>
      typeof user === undefined ? (
        <div>Loading...</div>
      ) : (
        <h1>Hello {user.name}!</h1>
      )
    }
  </LoadUser>,
  document.getElementById("root")
);
```

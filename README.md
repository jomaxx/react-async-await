# react-async-await

Async component that waits on promises to resolve!

## Motivation

Creating a promise is a synchronous action. If you hold a reference to a promise, you can eventually get the future value that it resolves to. Calling `setState` asynchronously in a component can cause a lot of headaches because of race conditions. The promise could still be in a pending state when the component unmounts or the props change. The `Async` component allows you to never worry about these race conditions and enables you to write your asynchronous react code as if it was synchronous.

## Install

```
yarn add react-async-await react
```

## Async Component

The `Async` component

* throws uncaught promise rejections so they can be handled by an [error boundary](https://reactjs.org/docs/error-boundaries.html)
* injects render callback with resolved value
* renders synchronously if the promise was already resolved by the Async component
* prevents race conditions when props change and components unmount

```js
import React from "react";
import ReactDOM from "react-dom";
import { Async } from "react-async-await";

const getUser = id =>
  fetch(`/api/users/${id}`).then(response => response.json());

class User extends React.Component {
  componentWillMount() {
    this.setState({
      promise: undefined,
      error: undefined
    });
  }

  componentDidMount() {
    this.setState({
      promise: getUser(this.props.id)
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      this.setState({
        promise: getUser(nextProps.id),
        error: undefined
      });
    }
  }

  // If this.state.promise rejects then Async component will throw error.
  // Error Boundaries allow you to recover from thrown errors.
  // @see https://reactjs.org/docs/error-boundaries.html
  componentDidCatch(error) {
    this.setState({ error });
  }

  render() {
    if (this.state.error) {
      return <div>An error occurred!</div>;
    }

    return (
      <Async await={this.state.promise}>
        {user => (user ? <div>Hello {user.name}!</div> : <div>Loading...</div>)}
      </Async>
    );
  }
}

ReactDOM.render(<User id={1} />, document.getElementById("root"));
```

## createLoader Factory

Create a wrapper component around `Async` that maps props to a promise when the component mounts.

```js
import React from "react";
import ReactDOM from "react-dom";
import { createLoader } from "react-async-await";

const getUser = id => fetch(`/api/users/${id}`).then(response => response.json());

const LoadUser = createLoader(
  props => getUser(props.id)), // loader
  props => props.id, // resolver
);

class User extends React.Component {
  componentWillMount() {
    this.setState({
      error: undefined
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      this.setState({
        error: undefined
      });
    }
  }

  // If this.state.promise rejects then Async component will throw error.
  // Error Boundaries allow you to recover from thrown errors.
  // @see https://reactjs.org/docs/error-boundaries.html
  componentDidCatch(error) {
    this.setState({ error });
  }

  render() {
    if (this.state.error) {
      return <div>An error occurred!</div>;
    }

    return (
      <LoadUser id={this.props.id}>
        {user => (user ? <div>Hello {user.name}!</div> : <div>Loading...</div>)}
      </LoadUser>
    );
  }
}

ReactDOM.render(<User id={1} />, document.getElementById("root"));
```

## Caching

Coupling the `Async` component or `createLoader` factory with a promise cache can be extremely powerful. Instead of creating a new promise every time your component receives props, you can resolve to a cached promise by using techniques like memoization. Below is an example using [`lodash/memoize`](https://lodash.com/docs/4.17.5#memoize).

```js
import React from "react";
import ReactDOM from "react-dom";
import { createLoader } from "react-async-await";
import memoize from "lodash/memoize";

// will return same promise when passed same id
// @see https://lodash.com/docs/4.17.5#memoize
const getUser = memoize(
  id => fetch(`/api/users/${id}`).then(response => response.json()),
  id => id,
);

const LoadUser = createLoader(
  props => getUser(props.id)), // loader
  props => props.id, // resolver
);

class User extends React.Component {
  componentWillMount() {
    this.setState({
      error: undefined
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      this.setState({
        error: undefined
      });
    }
  }

  // If this.state.promise rejects then Async component will throw error.
  // Error Boundaries allow you to recover from thrown errors.
  // @see https://reactjs.org/docs/error-boundaries.html
  componentDidCatch(error) {
    this.setState({ error });
  }

  render() {
    if (this.state.error) {
      return <div>An error occurred!</div>;
    }

    return (
      <LoadUser id={this.props.id}>
        {user => (user ? <div>Hello {user.name}!</div> : <div>Loading...</div>)}
      </LoadUser>
    );
  }
}

ReactDOM.render(<User id={1} />, document.getElementById("root"));
```

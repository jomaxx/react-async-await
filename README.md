# react-async-await

Async component that waits on promises to resolve!

### Motivation

Creating a promise is a synchronous action. If you hold a reference to a promise, you can eventually get the future value that it resolves to. Calling `setState` asynchronously in a component can cause a lot of headaches because of race conditions. The promise could still be in a pending state when the component unmounts or the props change. The `Async` component allows you to never worry about these race conditions and enables you to write your asynchronous react code as if it was synchronous.

The `Async` component

* throws uncaught promise rejections so they can be handled by an [error boundary](https://reactjs.org/docs/error-boundaries.html)
* injects render callback with resolved value
* renders synchronously if the promise was already resolved by the Async component
* prevents race conditions when props change and components unmount

### Install

```
yarn add react-async-await react
```

### Basic Usage

```js
import React from "react";
import { render } from "react-dom";
import { Async } from "react-async-await";
import memoize from "lodash/memoize";

// will return same promise when passed same id
// @see https://lodash.com/docs/4.17.5#memoize
const getUser = memoize(id =>
  fetch(`/api/users/${this.props.id}`).then(response => response.json())
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
      <Async await={getUser(this.props.id)}>
        {user => (user ? <div>Hello {user.name}!</div> : <div>Loading...</div>)}
      </Async>
    );
  }
}

render(<User id={1} />, document.getElementById("root"));
```

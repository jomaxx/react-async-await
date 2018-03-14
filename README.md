# react-async-await

Async component that waits on promises to resolve!

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

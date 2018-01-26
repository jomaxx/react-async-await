# react-async-await

Async component that waits on promises to resolve!

### Install

```
npm i react-async-await react --save
```

### Basic Usage

```js
import React from 'react';
import { render } from 'react-dom';
import Async from 'react-async-await';

class User extends React.Component {
  componentWillMount() {
    this.setState({
      promise: undefined,
    });
  }

  componentWillMount() {
    this.setState({
      promise: fetch(`/api/users/${this.props.id}`).then(r => r.json()),
    });
  }

  componentDidUpdate(prevProps) {
    // if id changes then we have to load the new user
    if (prevProps.id !== this.props.id) {
      this.componentWillMount();
    }
  }

  // If this.state.promise rejects then Async component will throw error.
  // Error Boundaries allow you to recover from thrown errors.
  // https://reactjs.org/docs/error-boundaries.html
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

render(<User id={1} />, document.getElementById('root'));
```

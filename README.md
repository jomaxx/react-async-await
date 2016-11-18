# react-async-await

### Install
```
npm i react-async-await react --save
```

### Basic Usage

```js
import React from 'react';
import { render } from 'react-dom';
import asyncAwait from 'react-async-await';

const fetchUser = (userId) => fetch(`/api/users/${userId}`).then(response => response.json());

const mapPropsToPromise = ({ id }) => fetchUser(id);

const shouldUpdatePromise = (props, prevProps) => props.id !== prevProps.id;

function User({
  waiting,
  result: user,
  error,
  update, // update the promise
}) {
  if (waiting) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (user) return <div>Hello {user.name}</div>;
  return null;
}

const AsyncUser = asyncAwait(
  mapPropsToPromise,
  shouldUpdatePromise,
  false // defer - when true won't mapPropsToPromise on componentWillMount (default = false)
)(User);

render(
  <AsyncUser id={1} />,
  document.getElementById('root')
);
```

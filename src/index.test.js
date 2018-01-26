import React from 'react';
import ReactDOM from 'react-dom';
import Async from './index';

const mountNode = document.body.appendChild(document.createElement('div'));
const mount = element => ReactDOM.render(element, mountNode);

afterEach(() => {
  ReactDOM.unmountComponentAtNode(mountNode);
});

test('renders', () => {
  expect(() => mount(<Async />)).not.toThrowError();
});

test('resolves promise', done => {
  const values = [true, undefined];

  mount(
    <Async await={Promise.resolve(values[0])}>
      {value => {
        try {
          expect(value).toBe(values.pop());
          return null;
        } finally {
          if (!values.length) {
            done();
          }
        }
      }}
    </Async>,
  );
});

test('ignores previous promise', done => {
  const values = [2, undefined, undefined];

  const inst1 = mount(
    <Async await={Promise.resolve(1)}>
      {value => {
        try {
          expect(value).toBe(values.pop());
          return null;
        } finally {
          if (!values.length) {
            done();
          }
        }
      }}
    </Async>,
  );

  const inst2 = mount(
    <Async await={Promise.resolve(2)}>
      {value => {
        try {
          expect(value).toBe(values.pop());
          return null;
        } finally {
          if (!values.length) {
            done();
          }
        }
      }}
    </Async>,
  );

  expect(inst1).toBe(inst2);
});

test('catches error in error boundary', done => {
  const error = new Error('test');

  class ErrorBoundary extends React.Component {
    componentDidCatch(caughtError) {
      expect(caughtError).toBe(error);
      done();
    }

    render() {
      return this.props.children;
    }
  }

  mount(
    <ErrorBoundary>
      <Async await={Promise.reject(error)}>{value => null}</Async>
    </ErrorBoundary>,
  );
});

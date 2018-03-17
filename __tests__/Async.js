import React from "react";
import { mount } from "testUtils";
import { Async } from "../";

class ErrorBoundary extends React.Component {
  componentDidCatch(error) {
    this.props.onError(error);
  }

  render() {
    return this.props.children;
  }
}

test("renders (default)", () => {
  expect(() => mount(<Async />)).not.toThrowError();
});

test("supports non-promise values", () => {
  const onError = jest.fn();

  [1, {}, [], undefined, null].forEach(notPromise => {
    mount(
      <ErrorBoundary onError={onError}>
        <Async await={notPromise} />
      </ErrorBoundary>
    );
  });

  expect(onError).toHaveBeenCalledTimes(0);
});

test("resolves promise", async () => {
  const promise = Promise.resolve(1);
  const render = jest.fn(() => null);

  mount(<Async await={promise}>{render}</Async>);

  await promise;

  expect(render.mock.calls).toEqual([[undefined], [1]]);
});

test("ignores previous promise", async () => {
  const promise = Promise.resolve(1);
  const promise2 = Promise.resolve(2);
  const render = jest.fn(() => null);

  mount(<Async await={promise}>{render}</Async>);

  mount(<Async await={promise2}>{render}</Async>);

  await Promise.all([promise, promise2]);

  expect(render.mock.calls).toEqual([[undefined], [undefined], [2]]);
});

test("catches error in error boundary", done => {
  const error = new Error("test");
  const onError = jest.fn();

  mount(
    <ErrorBoundary
      onError={caught => {
        expect(caught).toBe(error);
        done();
      }}
    >
      <Async await={Promise.reject(error)}>{value => null}</Async>
    </ErrorBoundary>
  );
});

test("skips loading if previously resolved", async () => {
  const promise = Promise.resolve(1);
  const renderA = jest.fn(() => null);
  const renderB = jest.fn(() => null);

  mount(<Async await={promise}>{renderA}</Async>);

  await promise;

  mount(<Async await={promise}>{renderB}</Async>);

  expect(renderA.mock.calls).toEqual([[undefined], [1]]);
  expect(renderB.mock.calls).toEqual([[1]]);
});

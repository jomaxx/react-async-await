import React from "react";
import ReactDOM from "react-dom";
import { createLoader } from "../";

const mountNode = document.body.appendChild(document.createElement("div"));
const mount = element => ReactDOM.render(element, mountNode);

const Loader = createLoader(props => props.promise, props => props.promise);

test("has default resolver", () => {
  const Test = createLoader(() => null);
  expect(() => mount(<Test />)).not.toThrowError();
});

test("renders (default)", () => {
  expect(() => mount(<Loader />)).not.toThrowError();
});

test("loads promise", async () => {
  const a = Promise.resolve(1);
  const render = jest.fn(() => null);

  mount(<Loader promise={a}>{render}</Loader>);

  await a;

  expect(render.mock.calls).toEqual([[], [1]]);
});

test("resolves to new promise", async () => {
  const a = Promise.resolve(1);
  const b = Promise.resolve(2);
  const render = jest.fn(() => null);

  mount(<Loader promise={a}>{render}</Loader>);
  mount(<Loader promise={b}>{render}</Loader>);

  await Promise.all([a, b]);

  expect(render.mock.calls).toEqual([[], [], [2]]);
});

import React from "react";
import { mount } from "testUtils";
import { createLoader } from "../";

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

  expect(render.mock.calls).toEqual([[undefined], [undefined], [1]]);
});

test("resolves to new promise", async () => {
  const a = Promise.resolve(1);
  const b = Promise.resolve(2);
  const render = jest.fn(() => null);

  mount(<Loader promise={a}>{render}</Loader>);
  mount(<Loader promise={b}>{render}</Loader>);

  await Promise.all([a, b]);

  expect(render.mock.calls).toEqual([
    [undefined],
    [undefined],
    [undefined],
    [2]
  ]);
});

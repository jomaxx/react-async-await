import React from "react";

const cache = new WeakMap();

const getCachedState = promise => {
  if (!cache.has(promise)) {
    const result = {
      status: 0,
      value: undefined,
      error: undefined
    };

    promise.then(
      value => {
        result.status = 1;
        result.value = value;
      },
      error => {
        result.status = 2;
        result.error = error;
      }
    );

    cache.set(promise, result);
  }

  return cache.get(promise);
};

class Async extends React.Component {
  componentWillMount() {
    this.setState(getCachedState(this.props.await));
  }

  componentWillReceiveProps(nextProps) {
    this.setState(getCachedState(nextProps.await));
  }

  componentDidMount() {
    let subscribed = true;

    this.componentWillUnmount = () => {
      subscribed = false;
    };

    this.props.await.then(
      () => subscribed && this.componentWillMount(),
      () => subscribed && this.componentWillMount()
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.await !== this.props.await) {
      this.componentWillUnmount();
      this.componentDidMount();
    }
  }

  render() {
    const { status, value, error } = this.state;

    switch (status) {
      case 0:
        return this.props.children();
      case 1:
        return this.props.children(value);
      case 2:
        throw error;
      default:
        throw new Error("unknown status");
    }
  }
}

Async.defaultProps = {
  await: Promise.resolve(),
  children: () => null
};

export default Async;

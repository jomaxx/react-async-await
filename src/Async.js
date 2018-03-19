import React from "react";

const cache = new WeakMap();

function getCachedState(promise) {
  const isPromise = promise && typeof promise.then === "function";

  if (!isPromise) {
    return {
      status: 1,
      value: promise,
      error: undefined
    };
  }

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
}

class Async extends React.Component {
  static defaultProps = {
    children: () => null
  };

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

    if (this.state.status === 0) {
      this.props.await.then(
        () => subscribed && this.componentWillMount(),
        error => subscribed && this.componentWillMount()
      );
    }
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
      // @todo support suspense
      // throw this.props.await;
      case 1:
        return this.props.children(value);
      case 2:
        if (this.props.catch) {
          return this.props.children(this.props.catch(error));
        }

        throw error;
      default:
        throw new Error("unknown status");
    }
  }
}

export default Async;

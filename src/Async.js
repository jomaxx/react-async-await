import React from "react";

const cache = new WeakMap();

function getCachedState(promise) {
  const isPromise = promise && typeof promise.then === "function";

  if (!isPromise) {
    return {
      status: 1,
      result: promise,
      error: undefined
    };
  }

  if (!cache.has(promise)) {
    const cached = {
      status: 0,
      result: undefined,
      error: undefined
    };

    promise.then(
      result => {
        cached.status = 1;
        cached.result = result;
      },
      error => {
        cached.status = 2;
        cached.error = error;
      }
    );

    cache.set(promise, cached);
  }

  return cache.get(promise);
}

class Async extends React.Component {
  static defaultProps = {
    children() {
      return null;
    },

    waiting(promise) {
      // @todo support suspense by default
      // throw promise;
    },

    then(result) {
      return result;
    },

    catch(error) {
      throw error;
    }
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
        () => subscribed && this.componentWillMount()
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
    const { status, result, error } = this.state;

    switch (status) {
      case 0:
        return this.props.children(this.props.waiting(this.props.await));
      case 1:
        return this.props.children(this.props.then(result));
      case 2:
        return this.props.children(this.props.catch(error));
      default:
        throw new Error("unknown status");
    }
  }
}

export default Async;

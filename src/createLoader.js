import React from "react";
import Async from "./Async";

function noop() {}

export default function createLoader(loader, resolver = noop) {
  return class Loader extends React.Component {
    state = {};

    componentDidMount() {
      this.setState({
        promise: loader(this.props),
        promiseKey: resolver(this.props)
      });
    }

    componentWillReceiveProps(nextProps) {
      const nextPromiseKey = resolver(nextProps);

      if (this.state.promiseKey !== nextPromiseKey) {
        this.setState({
          promise: loader(nextProps),
          promiseKey: nextPromiseKey
        });
      }
    }

    render() {
      return <Async await={this.state.promise}>{this.props.children}</Async>;
    }
  };
}

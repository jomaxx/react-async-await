import React from 'react';

class Async extends React.Component {
  componentWillMount() {
    this.setState({
      error: undefined,
      value: undefined,
    });
  }

  componentDidMount() {
    let canceled = false;

    this.componentWillUnmount = () => {
      canceled = true;
    };

    Promise.resolve(this.props.await).then(
      value => !canceled && this.setState({ value }),
      error => !canceled && this.setState({ error }),
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.await !== this.props.await) {
      this.componentWillUnmount();
      this.componentWillMount();
    }
  }

  // Throw error in lifecycle so that it can be caught by an error boundary.
  // https://reactjs.org/docs/error-boundaries.html
  componentWillUpdate(nextProps, nextState) {
    if (nextState.error && nextState.error !== this.state.error) {
      throw nextState.error;
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.await !== this.props.await) {
      this.componentDidMount();
    }
  }

  render() {
    return this.props.children(this.state.value);
  }
}

export default Async;

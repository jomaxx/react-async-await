import React, { Component } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { makeCancelable, isPromise, isCancelable, noop } from './utils';

export { makeCancelable, isCancelable } from './utils';

export default function asyncAwait(
  mapPropsToPromise,
  shouldUpdatePromise = () => false,
  defer
) {
  return (WrappedComponent) => {
    class Wrap extends Component {
      constructor(props) {
        super(props);

        this.state = {
          waiting: false,
          result: undefined,
          error: undefined,
        };

        this.cancel = noop;

        this.update = () => {
          this.updatePromise(mapPropsToPromise(this.props));
        };
      }

      componentWillMount() {
        if (!defer) {
          this.updatePromise(mapPropsToPromise(this.props));
        }
      }

      componentWillReceiveProps(nextProps) {
        if (shouldUpdatePromise(nextProps, this.props)) {
          this.updatePromise(mapPropsToPromise(nextProps));
        }
      }

      componentWillUnmount() {
        this.cancel();
      }

      updatePromise(nextPromise) {
        this.cancel();

        if (isCancelable(nextPromise)) {
          this.updatePromise(nextPromise.promise);

          this.cancel = (cancel => () => {
            nextPromise.cancel();
            cancel();
          })(this.cancel);

          return;
        }

        if (isPromise(nextPromise)) {
          const { cancel, promise } = makeCancelable(nextPromise);

          this.cancel = () => {
            cancel();
            this.cancel = noop;
          };

          this.setState({
            waiting: true,
            result: undefined,
            error: undefined,
          });

          promise.then(
            result => this.setState({ result, waiting: false }),
            error => !error.canceled && this.setState({ error, waiting: false })
          );

          return;
        }

        this.setState({
          waiting: false,
          result: nextPromise,
          error: undefined,
        });
      }

      render() {
        return (
          <WrappedComponent
            {...this.state}
            update={this.update}
            {...this.props}
          />
        );
      }
    }

    Wrap.displayName = `asyncAwait(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    Wrap.WrappedComponent = WrappedComponent;
    hoistNonReactStatic(Wrap, WrappedComponent);

    return Wrap;
  };
}

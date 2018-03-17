/**
 * @module ReactAsyncAwait
 */

/**
 * Component that takes a promise and injects the render callback with the resolved value.
 *
 * @example
 * import React from 'react';
 * import ReactDOM from 'react-dom';
 * import { Async } from 'react-async-await';
 *
 * class LoadUser extends React.Component {
 *   componentWillMount() {
 *     this.setState({
 *       error: undefined,
 *       promise: undefined
 *     });
 *   }
 *
 *   componentDidMount() {
 *     this.setState({
 *       promise: fetch(`/api/users/${this.props.id}`).then(r => r.json())
 *     });
 *   }
 *
 *   componentWillReceiveProps(nextProps) {
 *     if (this.props.id !== nextProps.id) {
 *       this.setState({
 *         error: undefined,
 *         promise: fetch(`/api/users/${nextProps.id}`).then(r => r.json())
 *       });
 *     }
 *   }
 *
 *   componentDidCatch(error) {
 *     this.setState({ error });
 *   }
 *
 *   render() {
 *     return this.state.error ? (
 *       <div>Uncaught promise rejection: {this.state.error.message}</div>
 *     ) : (
 *       <Async await={this.state.promise}>{this.props.children}</Async>
 *     );
 *   }
 * }
 *
 * ReactDOM.render(
 *   <LoadUser id={1}>
 *     {user =>
 *       typeof user === undefined ? (
 *         <div>Loading...</div>
 *       ) : (
 *         <h1>Hello {user.name}!</h1>
 *       )
 *     }
 *   </LoadUser>,
 *   document.getElementById('root')
 * );
 *
 * @name Async
 * @extends ReactComponent
 * @param {object} props
 * @param {*} [props.await]
 * @return {ReactElement}
 */
export { default as Async } from "./Async";

/**
 * Create a wrapper component around `Async` that maps props to a promise when the component mounts.
 *
 * @example
 * import React from 'react';
 * import ReactDOM from 'react-dom';
 * import { createLoader } from 'react-async-await';
 *
 * const LoadUser = createLoader(
 *   props => fetch(`/api/users/${props.id}`).then(r => r.json()),
 *   props => props.id // when key changes the loader is called again
 * );
 *
 * ReactDOM.render(
 *   <LoadUser id={1}>
 *     {user =>
 *       typeof user === undefined ? (
 *         <div>Loading...</div>
 *       ) : (
 *         <h1>Hello {user.name}!</h1>
 *       )
 *     }
 *   </LoadUser>,
 *   document.getElementById('root')
 * );
 *
 * @example <caption>memoized loader</caption>
 * import React from 'react';
 * import ReactDOM from 'react-dom';
 * import { createLoader } from 'react-async-await';
 * // https://lodash.com/docs/4.17.5#memoize
 * import memoize from 'lodash/memoize';
 *
 * const loader = memoize(
 *   props => fetch(`/api/users/${props.id}`).then(r => r.json()),
 *   props => props.id // key is used to resolve to cached value
 * );
 *
 * const LoadUser = createLoader(
 *   loader,
 *   props => props.id // when key changes the loader is called again
 * );
 *
 * ReactDOM.render(
 *   <LoadUser id={1}>
 *     {user =>
 *       typeof user === undefined ? (
 *         <div>Loading...</div>
 *       ) : (
 *         <h1>Hello {user.name}!</h1>
 *       )
 *     }
 *   </LoadUser>,
 *   document.getElementById('root')
 * );
 * @name createLoader
 * @function
 * @param {function} loader - loader maps props to a promise
 * @param {function} [resolver] - resolver maps props to a key
 * @return {ReactComponent}
 */
export { default as createLoader } from "./createLoader";

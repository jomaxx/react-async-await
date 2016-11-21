export const makeCancelable = (promise) => {
  let canceled = false;

  return {
    promise: promise.then(
      result => canceled ? Promise.reject({ canceled }) : result,
      error => canceled ? Promise.reject({ canceled }) : Promise.reject(error)
    ),

    cancel() {
      canceled = true;
    },
  };
};

export const isFunction = (fn) => typeof fn === 'function';

export const isPromise = (promise = {}) => isFunction(promise.then);

export const isCancelable = ({ cancel, promise } = {}) => isFunction(cancel) && isPromise(promise);

export const noop = () => {};

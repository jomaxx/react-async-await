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

export const isPromise = (promise = {}) => typeof promise.then === 'function';

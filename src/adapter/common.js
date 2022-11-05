import { createEffect } from "./../signal.js";

export const createExternalStore = (signal, selector = (x) => x, args = []) => {
  const value = selector(signal(...args));

  const listeners = new Set();

  createEffect(() => {
    // todo: not ideal
    const subscribeToSignals = (obj) => {
      if (typeof obj === "function" && obj.__signal) {
        obj();
      } else if (typeof obj === "object") {
        Object.values(obj).forEach(subscribeToSignals);
      } else if (typeof obj === "array") {
        obj.forEach(subscribeToSignals);
      }
    };

    subscribeToSignals(value);

    listeners.forEach((listener) => listener(value));
  });

  return {
    subscribe: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    value,
  };
};

// todo: find another way, cauz that's pretty eavy
export const unwrapSignals = (obj) => {
  if (typeof obj === "function" && obj.__signal) {
    return obj();
  } else if (typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, unwrapSignals(value)])
    );
  } else if (typeof obj === "array") {
    return obj.map(unwrapSignals);
  } else {
    return obj;
  }
};

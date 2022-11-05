import { useMemo, useState, useEffect, useCallback } from "react";
import { createExternalStore, unwrapSignals } from "./common.js";

// transform any signal into a react hook with a selector
export const createReactSignal = (signal) => {
  return (selector, args) => {
    const s = useMemo(() => createExternalStore(signal, selector, args), []);
    const [value, setValue] = useState(s.value);

    const memoizedUnwrapSignals = useCallback(unwrapSignals, [value]);

    useEffect(() => {
      return s.subscribe((v) => {
        // create new refs to force rerender
        // todo: find another way, that's also pretty eavy
        if (typeof v === "object") {
          setValue({ ...v });
        } else if (typeof v === "array") {
          setValue([...v]);
        } else {
          setValue(v);
        }
      });
    }, []);

    return memoizedUnwrapSignals(value);
  };
};

// same as createReactSignal but with a transaprent selector
export const createReactSignalHook = (signal) => {
  const useSignal = createReactSignal(signal);

  return (...args) => {
    return useSignal((x) => x, args);
  };
};

import { writable, get } from "svelte/store";
import { onMount } from "svelte";
import { createExternalStore, unwrapSignals } from "./common.js";

// transform any signal into a svelte writable with a selector
export const createSvelteSignalStore = (signal) => {
  return (...args) => {
    const s = createExternalStore(signal, (x) => x, args);
    const store = writable(unwrapSignals(s.value));

    console.log("new initial", get(store));

    onMount(() => {
      return s.subscribe((v) => {
        console.log("transform", v.count());
        store.set(unwrapSignals(v));
      });
    });

    return {
      // transform into a svelte readable
      subscribe: store.subscribe,
    };
  };
};

# Reactive-framework POC

This is a POC to see if an unopinionated reactive framework (like react hooks but framework-agnostic) with adapters for react, svelte, solid, etc. would be viable.

Such a framework could be useful for multiple use cases. For instance, when creating a framework-agnostic library like tanstack tables & query, the trpc client, felte, etc.
Or even for sharing application logic for multiples frontends (web, mobile, tv, etc).
Theses projects tends to use an unopinionated core, but there's a few cons to creating such an architecture/core by hand:
- hard to write reactive code without a reactive framework
- codebase difficult to maintain on medium/large projects (because, again, no framework to wrap your mind around)
- difficulties to adapt the unopinionated core to other frameworks
- 

So this repo is just a little draft of what such a framework could look like.

**Please note that this is just a POC. The code is ugly and unoptimized, there are loads of bugs and very rough edges.** PRs welcome :)

## Current API

The current API is extremly basic and pretty much a copy of SolidJS:
```ts
const createCount = () => {
  const [count, setCount] = createSignal(0);

  createEffect(() => {
    console.log("new count", count());
  });

  return {
    count,
    increment: () => setCount(count() + 1),
    decrement: () => setCount(count() - 1),
  };
};
```

## Examples

### React

https://github.com/AnatoleLucet/reactive-framework/blob/main/fixtures/react/src/App.jsx

```tsx
import { createReactSignalHook } from "../../../src/adapter/react";
import { createSignal, createEffect } from "../../../src/signal";

const createCount = () => {
  const [count, setCount] = createSignal(0);

  createEffect(() => {
    console.log("new count", count());
  });

  return {
    count,
    increment: () => setCount(count() + 1),
    decrement: () => setCount(count() - 1),
  };
};

const useCountStore = createReactSignalHook(createCount);

function Component() {
  const { count, increment } = useCountStore();

  return (
    <button onClick={() => increment()}>count is {count}</button>
  );
}
```

### Svelte

https://github.com/AnatoleLucet/reactive-framework/blob/main/fixtures/svelte/src/App.svelte

```svelte
<script>
  import { createSvelteSignalStore } from "../../../src/adapter/svelte";
  import { createSignal, createEffect } from "../../../src/signal";

  // -- count
  const createCount = (initial) => {
    const [count, setCount] = createSignal(initial);

    createEffect(() => {
      console.log("new count", count());
    });

    return {
      count,
      increment: () => setCount(count() + 1),
      decrement: () => setCount(count() - 1),
    };
  };

  const createCountStore = createSvelteSignalStore(createCount);
  // -- count

  const countStore = createCountStore();
</script>

<button on:click={$countStore.increment}>count is {$countStore.count}</button>
```

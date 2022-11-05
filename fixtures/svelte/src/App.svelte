<script>
  import svelteLogo from "./assets/svelte.svg";
  import { createSvelteSignalStore } from "../../../src/adapter/svelte";
  import { createSignal, createEffect } from "../../../src/signal";

  // -- count
  const createCount = (initial) => {
    const [count, setCount] = createSignal(initial);

    createEffect(() => {
      console.log("signal new count", count());
    });

    return {
      count,
      // @ts-expect-error
      increment: () => setCount(count() + 1),
      // @ts-expect-error
      decrement: () => setCount(count() - 1),
    };
  };

  const createCountStore = createSvelteSignalStore(createCount);
  // -- count

  let initialValue = 1;

  $: countStore = createCountStore(initialValue);

  $: countStore.subscribe((count) => {
    console.log("sub", count);
  });

  $: count = $countStore.count;
  $: increment = $countStore.increment;
</script>

<main>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>Vite + Svelte</h1>

  <div class="card">
    <button on:click={increment}>{count}</button>
    <button on:click={() => initialValue++}>{initialValue}</button>
  </div>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank"
      >SvelteKit</a
    >, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">Click on the Vite and Svelte logos to learn more</p>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>

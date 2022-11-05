import reactLogo from "./assets/react.svg";
import "./App.css";
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

function App() {
  const { count, increment } = useCountStore();

  console.log("render", count);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => increment()}>count is {count}</button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;

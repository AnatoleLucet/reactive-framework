let effects = [];
let signals = [];

const ctx = {
  record: false,
  signals: [],
};

export const createSignal = (initialValue) => {
  let value = initialValue;

  const signal = {
    changed: false,
  };

  signals.push(signal);

  const getSignal = () => {
    if (ctx.record) {
      ctx.signals.push(signal);
    }

    return value;
  };

  getSignal.__signal = signal;

  return [
    getSignal,
    (newValue) => {
      value = newValue;

      signal.changed = true;

      // todo: batching
      runEffects();
    },
  ];
};

const recordEffect = (fn) => {
  ctx.record = true;
  fn();
  ctx.record = false;

  const effect = {
    deps: ctx.signals,
    fn,
  };
  ctx.signals = [];

  return effect;
};

export const createEffect = (fn) => {
  effects.push(recordEffect(fn));
};

const runEffects = () => {
  for (const effect of effects) {
    if (effect.deps.some((signal) => signal.changed)) {
      effect.deps = recordEffect(effect.fn).deps;
    }
  }
};

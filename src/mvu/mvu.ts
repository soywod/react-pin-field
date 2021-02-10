import {useEffect, useReducer, useState} from "react";

import {Updater, Notifier} from "./mvu.types";

/**
 * Model-View-Update hook.
 * Ensures good practices by separating your state management from your side effects.
 */
export function useMVU<M, A, E>(defaultModel: M, update: Updater<M, A, E>, notify: Notifier<M, A, E>) {
  const [effects, setEffects] = useState<E[]>([]);

  function reducer(model: M, action: A): M {
    const [nextModel, nextEffects] = update(model, action);
    setEffects(nextEffects);
    return nextModel;
  }

  const [model, dispatch] = useReducer(reducer, defaultModel);

  useEffect(() => {
    if (effects.length > 0) {
      effects.forEach(eff => notify(eff, model, dispatch));
      setEffects([]);
    }
  }, [effects, model, notify]);

  return dispatch;
}

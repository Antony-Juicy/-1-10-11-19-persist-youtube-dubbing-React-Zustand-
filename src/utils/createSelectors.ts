import { StoreApi, UseBoundStore } from 'zustand'

type WithSelectors<S extends UseBoundStore<StoreApi<object>>> = S & {
  use: { [K in keyof ReturnType<S['getState']>]: () => ReturnType<S['getState']>[K] }
}

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(store: S) => {
  type State = ReturnType<S['getState']>
  const enhanced = store as WithSelectors<S>
  enhanced.use = {} as WithSelectors<S>['use']
  for (const key of Object.keys(store.getState()) as (keyof State)[]) {
    enhanced.use[key] = () => store((state) => (state as State)[key])
  }
  return enhanced
}

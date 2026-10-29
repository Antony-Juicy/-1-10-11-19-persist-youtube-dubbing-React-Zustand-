import { create } from 'zustand'
import { createStore } from 'zustand/vanilla'
import { createWithEqualityFn } from 'zustand/traditional'
import { redux } from 'zustand/middleware'
import { shallow } from 'zustand/vanilla/shallow'

export const createCounterStore = () => createStore<{ count: number; label: string }>()(() => ({
  count: 0,
  label: '独立实例',
}))

export const useEqualityStore = createWithEqualityFn<{ count: number; other: number }>()(
  () => ({ count: 0, other: 0 }),
  shallow,
)

type Action = { type: 'increment'; by: number } | { type: 'reset' }
export const useReducerStore = create(redux(
  (state: { count: number }, action: Action) =>
    action.type === 'increment' ? { count: state.count + action.by } : { count: 0 },
  { count: 0 },
))

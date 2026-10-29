import { test } from 'node:test'
import assert from 'node:assert/strict'
import { useSetStore, useSelectorStore, usePersistStore, useBasicStore, externalActions } from '../src/stores/apiStore'
import { createCounterStore, useReducerStore } from '../src/stores/advancedStore'
import { useTodoStore } from '../src/stores/todoStore'
import { selectFilteredTodos, selectTodoStats } from '../src/stores/todoSelectors'

test('外部 action 真正更新共享 store', () => {
  externalActions.reset()
  externalActions.increment()
  assert.equal(useBasicStore.getState().count, 1)
})

test('完整替换后 action 仍可调用', () => {
  useSetStore.getState().replaceAll()
  useSetStore.getState().updateByFunction()
  assert.equal(useSetStore.getState().value, 101)
  useSetStore.getState().replaceAll()
  assert.equal(useSetStore.getState().text, 'replaced')
})

test('selector 仅通知目标变化，取消后不再通知', () => {
  const calls: number[] = []
  const unsubscribe = useSelectorStore.subscribe((state) => state.count1, (value) => calls.push(value))
  useSelectorStore.getState().increment2()
  assert.equal(calls.length, 0)
  useSelectorStore.getState().increment1()
  assert.equal(calls.length, 1)
  unsubscribe()
  useSelectorStore.getState().increment1()
  assert.equal(calls.length, 1)
})

test('vanilla 实例隔离与完整重置', () => {
  const a = createCounterStore()
  const b = createCounterStore()
  a.setState({ count: 7 })
  assert.equal(b.getState().count, 0)
  a.setState(a.getInitialState(), true)
  assert.equal(a.getState().count, 0)
  assert.equal(a.getState().label, '独立实例')
})

test('Todo 新增、组合筛选、统计、完成与删除', () => {
  const store = useTodoStore
  store.getState().clearAll()
  store.getState().addTodo('学习 v5', 'selector', 'high')
  store.getState().addTodo('练习', '', 'low')
  const todo = store.getState().todos.find((item) => item.title === '学习 v5')!
  const previous = store.getState().todos
  store.getState().toggleTodo(todo.id)
  assert.equal(previous.find((item) => item.id === todo.id)?.status, 'todo')
  assert.equal(selectTodoStats(store.getState().todos).completed, 1)
  assert.equal(selectFilteredTodos(store.getState().todos, { search: ' V5 ', priority: 'high', status: 'done' }).length, 1)
  store.getState().clearCompleted()
  assert.equal(store.getState().todos.length, 1)
  store.getState().deleteTodo(store.getState().todos[0].id)
  assert.equal(store.getState().todos.length, 0)
})

test('reducer 支持增量和重置', () => {
  useReducerStore.getState().dispatch({ type: 'increment', by: 2 })
  assert.equal(useReducerStore.getState().count, 2)
  useReducerStore.getState().dispatch({ type: 'reset' })
  assert.equal(useReducerStore.getState().count, 0)
})

test('持久化恢复、partialize 和清存储语义', async () => {
  const store = usePersistStore
  store.getState().updateTheme('dark')
  store.getState().addTemporaryData('不保存')
  const saved = localStorage.getItem('persist-store')!
  assert.equal(JSON.parse(saved).state.temporaryData, undefined)
  store.getState().updateTheme('light')
  localStorage.setItem('persist-store', saved)
  await store.persist.rehydrate()
  assert.equal(store.getState().settings.theme, 'dark')
  await store.persist.clearStorage()
  assert.equal(localStorage.getItem('persist-store'), null)
  assert.equal(store.getState().settings.theme, 'dark')
})

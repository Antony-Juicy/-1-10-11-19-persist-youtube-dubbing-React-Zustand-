import { create } from 'zustand'
import { useMemo } from 'react'
import { selectFilteredTodos, selectTodoStats } from './todoSelectors'
import { useShallow } from 'zustand/react/shallow'
import { immer } from 'zustand/middleware/immer'
import { devtools, persist, subscribeWithSelector, createJSONStorage } from 'zustand/middleware'

// 类型定义
export type Priority = 'low' | 'medium' | 'high'
export type Status = 'todo' | 'in-progress' | 'done'

export interface Todo {
  id: string
  title: string
  description: string
  priority: Priority
  status: Status
  createdAt: number
  completedAt?: number
}

export interface FilterState {
  search: string
  priority: Priority | 'all'
  status: Status | 'all'
}

// 主状态类型
interface TodoStoreState {
  todos: Todo[]
  filter: FilterState

  // Todo 操作
  addTodo: (title: string, description: string, priority: Priority) => void
  updateTodo: (id: string, updates: Partial<Todo>) => void
  deleteTodo: (id: string) => void
  toggleTodo: (id: string) => void
  clearCompleted: () => void
  clearAll: () => void

  // 过滤操作
  setSearch: (search: string) => void
  setPriorityFilter: (priority: Priority | 'all') => void
  setStatusFilter: (status: Status | 'all') => void
  resetFilter: () => void

  // 计算属性
  getFilteredTodos: () => Todo[]
  getStats: () => {
    total: number
    completed: number
    pending: number
    todoCount: number
    inProgress: number
    byPriority: Record<Priority, number>
  }
}

// 初始状态
const initialFilter: FilterState = {
  search: '',
  priority: 'all',
  status: 'all',
}

// 创建 store - 简化版本，不使用单独的 slice
export const useTodoStore = create<TodoStoreState>()(
  immer(
    devtools(
      subscribeWithSelector(
        persist(
          (set, get) => ({
            todos: [],
            filter: initialFilter,

            // 添加 todo
            addTodo: (title: string, description: string, priority: Priority) =>
              set((state) => {
                const newTodo: Todo = {
                  id: crypto.randomUUID(),
                  title,
                  description,
                  priority,
                  status: 'todo',
                  createdAt: Date.now(),
                }
                state.todos.unshift(newTodo)
              }),

            // 更新 todo
            updateTodo: (id, updates) =>
              set((state) => {
                const todo = state.todos.find((t: Todo) => t.id === id)
                if (todo) {
                  Object.assign(todo, updates)
                }
              }),

            // 删除 todo
            deleteTodo: (id) =>
              set((state) => {
                state.todos = state.todos.filter((t: Todo) => t.id !== id)
              }),

            // 切换完成状态
            toggleTodo: (id) =>
              set((state) => {
                const todo = state.todos.find((t: Todo) => t.id === id)
                if (todo) {
                  if (todo.status === 'done') {
                    todo.status = 'todo'
                    delete todo.completedAt
                  } else {
                    todo.status = 'done'
                    todo.completedAt = Date.now()
                  }
                }
              }),

            // 清除已完成
            clearCompleted: () =>
              set((state) => {
                state.todos = state.todos.filter((t: Todo) => t.status !== 'done')
              }),

            // 清空所有
            clearAll: () =>
              set((state) => {
                state.todos = []
              }),

            // 设置搜索
            setSearch: (search) =>
              set((state) => {
                state.filter.search = search
              }),

            // 设置优先级过滤
            setPriorityFilter: (priority) =>
              set((state) => {
                state.filter.priority = priority
              }),

            // 设置状态过滤
            setStatusFilter: (status) =>
              set((state) => {
                state.filter.status = status
              }),

            // 重置过滤
            resetFilter: () =>
              set((state) => {
                state.filter = { ...initialFilter }
              }),

            // 派生逻辑与组件 hooks 共用纯函数。
            getFilteredTodos: () => selectFilteredTodos(get().todos, get().filter),
            getStats: () => selectTodoStats(get().todos),
          }),
          {
            name: 'todo store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
              todos: state.todos,
              filter: state.filter,
            }),
          }
        )
      )
    )
  )
)

// Hooks - 性能优化的选择器
export const useTodos = () => useTodoStore((state) => state.todos)
export const useFilteredTodos = () => {
  const todos = useTodos()
  const filter = useTodoFilter()
  return useMemo(() => selectFilteredTodos(todos, filter), [todos, filter])
}
export const useTodoStats = () => {
  const todos = useTodos()
  return useMemo(() => selectTodoStats(todos), [todos])
}
export const useTodoFilter = () => useTodoStore((state) => state.filter)
export const useTodoActions = () =>
  useTodoStore(useShallow((state) => ({
    addTodo: state.addTodo,
    updateTodo: state.updateTodo,
    deleteTodo: state.deleteTodo,
    toggleTodo: state.toggleTodo,
    clearCompleted: state.clearCompleted,
    clearAll: state.clearAll,
    setSearch: state.setSearch,
    setPriorityFilter: state.setPriorityFilter,
    setStatusFilter: state.setStatusFilter,
    resetFilter: state.resetFilter,
  })))

// 外部 action - 可以在任何地方调用
export const addTodo = (title: string, description: string, priority: Priority = 'medium') => {
  useTodoStore.getState().addTodo(title, description, priority)
}

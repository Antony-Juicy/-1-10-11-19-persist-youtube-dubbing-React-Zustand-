import {
  useFilteredTodos,
  useTodoActions,
  useTodoFilter,
  useTodoStats,
  useTodos,
} from '../../stores/todoStore'
import { TodoItem } from './TodoItem'

const priorityLabels = {
  low: '低优先级',
  medium: '中优先级',
  high: '高优先级',
} as const

const statusLabels = {
  todo: '待办',
  'in-progress': '进行中',
  done: '已完成',
} as const

// 展示：使用 shallow 比较多个状态
export const TodoList = () => {
  const todos = useFilteredTodos()
  const allTodos = useTodos()
  const stats = useTodoStats()
  const filter = useTodoFilter()
  const { clearCompleted, clearAll } = useTodoActions()
  const hasFilters =
    Boolean(filter.search) || filter.priority !== 'all' || filter.status !== 'all'
  const activeFilters = [
    filter.search ? `搜索: ${filter.search}` : null,
    filter.priority !== 'all' ? `优先级: ${priorityLabels[filter.priority]}` : null,
    filter.status !== 'all' ? `状态: ${statusLabels[filter.status]}` : null,
  ].filter(Boolean) as string[]

  if (todos.length === 0) {
    return (
      <div className="todo-empty">
        <p className="todo-empty__title">
          {allTodos.length === 0 ? '还没有任务' : '当前筛选条件下没有匹配结果'}
        </p>
        <span className="todo-empty__description">
          {allTodos.length === 0
            ? '先从左侧创建第一条任务，这里会立刻出现结果。'
            : '可以放宽搜索词、优先级或状态条件，马上就能重新看到列表内容。'}
        </span>
        {activeFilters.length > 0 && (
          <div className="todo-empty__pills">
            {activeFilters.map((item) => (
              <span key={item} className="todo-empty__pill">
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="todo-list">
      <div className="todo-list-header">
        <div className="todo-list-header__copy">
          <span>{hasFilters ? `筛选结果 ${todos.length} 项` : `共 ${todos.length} 个任务`}</span>
          <small>
            {hasFilters
              ? `当前显示 ${todos.length} / ${allTodos.length}，已完成 ${stats.completed} 项`
              : `当前有 ${stats.inProgress} 项正在推进，高优先级 ${stats.byPriority.high} 项`}
          </small>
        </div>
        <div className="todo-actions">
          <button onClick={clearCompleted} className="btn btn-secondary">
            清除已完成
          </button>
          <button onClick={clearAll} className="btn btn-danger">
            清空全部
          </button>
        </div>
      </div>
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  )
}

// 展示：组件内订阅多个状态（推荐使用 shallow 或 hooks）
export const TodoListAlternative = () => {
  // 方式1：使用自定义 hook（推荐）
  const todos = useFilteredTodos()
  const { clearCompleted, clearAll } = useTodoActions()

  // 方式2：使用 selector + shallow
  // const [todos, clearCompleted, clearAll] = useTodoStore(
  //   (state) => [state.getFilteredTodos(), state.clearCompleted, state.clearAll],
  //   shallow
  // )

  // 方式3：直接订阅整个 store（不推荐，会导致不必要的重渲染）
  // const { getFilteredTodos, clearCompleted, clearAll } = useTodoStore()

  return (
    <div className="todo-list">
      <div className="todo-list-header">
        <span>共 {todos.length} 个任务</span>
        <div className="todo-actions">
          <button onClick={clearCompleted} className="btn btn-secondary">
            清除已完成
          </button>
          <button onClick={clearAll} className="btn btn-danger">
            清空全部
          </button>
        </div>
      </div>
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  )
}

import { TodoForm } from './TodoForm'
import { TodoFilter } from './TodoFilter'
import { TodoList } from './TodoList'
import { TodoStats } from './TodoStats'
import { useTodoFilter, useTodoStats } from '../../stores/todoStore'
import './index.css'

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

export const TodoApp = () => {
  const stats = useTodoStats()
  const filter = useTodoFilter()

  const progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
  const activeFilters = [
    filter.search ? `搜索: ${filter.search}` : null,
    filter.priority !== 'all' ? `优先级: ${priorityLabels[filter.priority]}` : null,
    filter.status !== 'all' ? `状态: ${statusLabels[filter.status]}` : null,
  ].filter(Boolean) as string[]

  const summaryTitle =
    stats.total === 0
      ? '工作区还是空的，先创建一条任务'
      : stats.completed === stats.total
        ? '这一轮任务已经清空，可以继续规划下一批'
        : `${stats.inProgress} 条任务正在推进，节奏已经起来了`

  const summaryDescription =
    stats.total === 0
      ? '左侧先录入第一条任务，列表和统计区会立刻联动起来。'
      : activeFilters.length > 0
        ? `当前有 ${activeFilters.length} 个过滤条件生效，任务列表会按这些条件即时收窄。`
        : '现在是完整视图，适合观察任务状态、优先级和派生统计之间的同步关系。'

  return (
    <div className="todo-app">
      <section className="todo-app__summary">
        <article className="todo-app__summary-card todo-app__summary-card--primary">
          <p className="todo-app__summary-eyebrow">Workspace Pulse</p>
          <h3>{summaryTitle}</h3>
          <span>{summaryDescription}</span>
          <div className="todo-progress">
            <div className="todo-progress__track">
              <span
                className="todo-progress__fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <strong>{progress}% 完成</strong>
          </div>
        </article>

        <article className="todo-app__summary-card">
          <p className="todo-app__summary-eyebrow">Quick Read</p>
          <div className="todo-app__metrics">
            <div className="todo-app__metric">
              <strong>{stats.total}</strong>
              <span>总任务</span>
            </div>
            <div className="todo-app__metric">
              <strong>{stats.inProgress}</strong>
              <span>进行中</span>
            </div>
            <div className="todo-app__metric">
              <strong>{stats.byPriority.high}</strong>
              <span>高优先级</span>
            </div>
          </div>
          <div className="todo-app__filter-pills">
            {activeFilters.length > 0 ? (
              activeFilters.map((item) => (
                <span key={item} className="todo-app__filter-pill">
                  {item}
                </span>
              ))
            ) : (
              <span className="todo-app__filter-pill todo-app__filter-pill--muted">
                当前没有启用过滤条件
              </span>
            )}
          </div>
        </article>
      </section>

      <div className="todo-app__grid">
        <aside className="todo-sidebar">
          <TodoForm />
          <TodoStats />
        </aside>

        <main className="todo-main">
          <TodoFilter />
          <TodoList />
        </main>
      </div>
    </div>
  )
}

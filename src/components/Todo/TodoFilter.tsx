import { useTodoFilter, useTodoActions } from '../../stores/todoStore'
import { Priority, Status } from '../../stores/todoStore'

const priorityLabels: Record<Priority, string> = {
  low: '低优先级',
  medium: '中优先级',
  high: '高优先级',
}

const statusLabels: Record<Status, string> = {
  todo: '待办',
  'in-progress': '进行中',
  done: '已完成',
}

export const TodoFilter = () => {
  const filter = useTodoFilter()
  const { setSearch, setPriorityFilter, setStatusFilter, resetFilter } =
    useTodoActions()
  const activeFilters = [
    filter.search ? `搜索: ${filter.search}` : null,
    filter.priority !== 'all' ? `优先级: ${priorityLabels[filter.priority]}` : null,
    filter.status !== 'all' ? `状态: ${statusLabels[filter.status]}` : null,
  ].filter(Boolean) as string[]

  return (
    <section className="todo-filter">
      <div className="todo-card-heading">
        <p>Filter Panel</p>
        <h2>过滤与检索</h2>
        <span>组合搜索词、优先级和状态，观察列表和统计结果如何同步变化。</span>
      </div>

      <div className="todo-filter__controls">
        <div className="filter-group">
          <label>搜索</label>
          <input
            type="text"
            value={filter.search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索任务..."
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>优先级</label>
          <select
            value={filter.priority}
            onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}
            className="filter-select"
          >
            <option value="all">全部</option>
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
        </div>

        <div className="filter-group">
          <label>状态</label>
          <select
            value={filter.status}
            onChange={(e) => setStatusFilter(e.target.value as Status | 'all')}
            className="filter-select"
          >
            <option value="all">全部</option>
            <option value="todo">待办</option>
            <option value="in-progress">进行中</option>
            <option value="done">已完成</option>
          </select>
        </div>

        {(filter.search ||
          filter.priority !== 'all' ||
          filter.status !== 'all') && (
          <button onClick={resetFilter} className="btn btn-sm btn-secondary">
            重置
          </button>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="todo-filter__active">
          <span className="todo-filter__active-label">当前过滤</span>
          <div className="todo-filter__active-pills">
            {activeFilters.map((item) => (
              <span key={item} className="todo-filter__active-pill">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export const FilterDisplay = () => {
  const currentFilter = useTodoFilter()

  return (
    <div className="filter-display">
      当前过滤: {JSON.stringify(currentFilter)}
    </div>
  )
}

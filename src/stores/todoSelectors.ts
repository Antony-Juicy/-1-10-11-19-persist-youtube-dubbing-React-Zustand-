import type { Todo, FilterState, Priority } from './todoStore'

export function selectFilteredTodos(todos: Todo[], filter: FilterState) {
  const search = filter.search.trim().toLowerCase()
  return todos.filter((todo) =>
    (!search || `${todo.title} ${todo.description}`.toLowerCase().includes(search)) &&
    (filter.priority === 'all' || todo.priority === filter.priority) &&
    (filter.status === 'all' || todo.status === filter.status))
}

export function selectTodoStats(todos: Todo[]) {
  const stats = {
    total: todos.length, completed: 0, pending: 0, todoCount: 0, inProgress: 0,
    byPriority: { low: 0, medium: 0, high: 0 } as Record<Priority, number>,
  }
  for (const todo of todos) {
    stats.byPriority[todo.priority]++
    if (todo.status === 'done') stats.completed++
    else if (todo.status === 'in-progress') stats.inProgress++
    else stats.todoCount++
  }
  stats.pending = stats.total - stats.completed
  return stats
}

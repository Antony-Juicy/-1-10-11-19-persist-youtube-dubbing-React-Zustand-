import { useState } from 'react'
import { Todo, Priority, Status } from '../../stores/todoStore'
import { useTodoActions } from '../../stores/todoStore'

const priorityLabels: Record<Priority, string> = {
  low: '低',
  medium: '中',
  high: '高',
}

const priorityColors: Record<Priority, string> = {
  low: '#4caf50',
  medium: '#ff9800',
  high: '#f44336',
}

const statusLabels: Record<Status, string> = {
  todo: '待办',
  'in-progress': '进行中',
  done: '已完成',
}

interface TodoItemProps {
  todo: Todo
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  const { updateTodo, deleteTodo, toggleTodo } = useTodoActions()
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const createdAtLabel = new Date(todo.createdAt).toLocaleString()
  const completedAtLabel = todo.completedAt
    ? new Date(todo.completedAt).toLocaleString()
    : null

  const handleSave = () => {
    if (editTitle.trim()) {
      updateTodo(todo.id, { title: editTitle })
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(todo.title)
    setIsEditing(false)
  }

  const isDone = todo.status === 'done'
  const handleStatusChange = (status: Status) => {
    if (status === todo.status) return

    updateTodo(todo.id, {
      status,
      completedAt: status === 'done' ? Date.now() : undefined,
    })
  }

  return (
    <li className={`todo-item ${isDone ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={isDone}
          onChange={() => toggleTodo(todo.id)}
          className="todo-checkbox"
        />

        <div className="todo-details">
          {isEditing ? (
            <div className="todo-edit">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave()
                  if (e.key === 'Escape') handleCancel()
                }}
                autoFocus
                className="todo-edit-input"
              />
              <button onClick={handleSave} className="btn btn-sm btn-primary">
                保存
              </button>
              <button onClick={handleCancel} className="btn btn-sm">
                取消
              </button>
            </div>
          ) : (
            <>
              <div className="todo-item-header">
                <h3 className="todo-title">{todo.title}</h3>
                <span
                  className="todo-priority"
                  style={{ backgroundColor: priorityColors[todo.priority] }}
                >
                  {priorityLabels[todo.priority]}
                </span>
                <span className="todo-status">{statusLabels[todo.status]}</span>
              </div>
              {todo.description && (
                <p className="todo-description">{todo.description}</p>
              )}
              <div className="todo-meta">
                <small>创建于: {createdAtLabel}</small>
                {completedAtLabel && <small>完成于: {completedAtLabel}</small>}
              </div>
            </>
          )}
        </div>

        {!isEditing && (
          <div className="todo-side-actions">
            <label className="todo-status-control">
              <span>状态</span>
              <select
                value={todo.status}
                onChange={(e) => handleStatusChange(e.target.value as Status)}
                className="todo-status-select"
              >
                <option value="todo">待办</option>
                <option value="in-progress">进行中</option>
                <option value="done">已完成</option>
              </select>
            </label>
            <div className="todo-buttons">
              <button onClick={() => setIsEditing(true)} className="btn btn-sm">
                编辑
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="btn btn-sm btn-danger"
              >
                删除
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  )
}

import { useState } from 'react'
import { useTodoActions } from '../../stores/todoStore'
import { Priority } from '../../stores/todoStore'

const priorityOptions: Array<{
  value: Priority
  label: string
  hint: string
}> = [
  { value: 'low', label: '低', hint: '可稍后处理' },
  { value: 'medium', label: '中', hint: '正常推进' },
  { value: 'high', label: '高', hint: '优先完成' },
]

export const TodoForm = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const { addTodo } = useTodoActions()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      addTodo(title, description, priority)
      setTitle('')
      setDescription('')
      setPriority('medium')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="todo-card-heading">
        <p>Quick Create</p>
        <h2>新建任务</h2>
        <span>用一个简洁表单测试 action 更新和列表渲染之间的联动。</span>
      </div>

      <div className="form-group">
        <label htmlFor="todo-title">任务标题 *</label>
        <input
          id="todo-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入任务标题..."
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="todo-description">任务描述</label>
        <textarea
          id="todo-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="输入任务描述..."
          rows={3}
          className="form-textarea"
        />
      </div>

      <div className="form-group">
        <label htmlFor="todo-priority">优先级</label>
        <div
          id="todo-priority"
          className="todo-priority-picker"
          role="radiogroup"
          aria-label="任务优先级"
        >
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`todo-priority-option ${priority === option.value ? 'is-active' : ''}`}
              onClick={() => setPriority(option.value)}
            >
              <span>{option.label}</span>
              <small>{option.hint}</small>
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="btn btn-primary">
        添加任务
      </button>
      <p className="todo-form__hint">新建任务会插入到列表顶部，方便你马上继续处理。</p>
    </form>
  )
}

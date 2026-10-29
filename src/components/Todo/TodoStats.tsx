import { useTodoStats } from '../../stores/todoStore'
import { useEffect } from 'react'

export const TodoStats = () => {
  const stats = useTodoStats()

  const progress =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <div className="todo-stats">
      <div className="todo-card-heading">
        <p>Derived State</p>
        <h3>任务概览</h3>
        <span>这些值来自 store 的派生结果，会随着列表状态即时同步。</span>
      </div>

      <div className="todo-stats__progress">
        <div className="todo-stats__progress-copy">
          <strong>当前完成进度</strong>
          <span>{stats.completed} / {stats.total || 0} 已完成</span>
        </div>
        <div className="todo-stats__progress-track">
          <span
            className="todo-stats__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">总任务</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.todoCount}</div>
          <div className="stat-label">待办池</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.inProgress}</div>
          <div className="stat-label">进行中</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">已完成</div>
        </div>
      </div>

      <div className="priority-stats">
        <h4>优先级分布</h4>
        <div className="priority-bars">
          <div className="priority-bar">
            <span className="priority-label low">低</span>
            <div className="bar-container">
              <div
                className="bar low"
                style={{
                  width:
                    stats.total > 0
                      ? `${(stats.byPriority.low / stats.total) * 100}%`
                      : '0%',
                }}
              />
            </div>
            <span className="priority-count">{stats.byPriority.low}</span>
          </div>
          <div className="priority-bar">
            <span className="priority-label medium">中</span>
            <div className="bar-container">
              <div
                className="bar medium"
                style={{
                  width:
                    stats.total > 0
                      ? `${(stats.byPriority.medium / stats.total) * 100}%`
                      : '0%',
                }}
              />
            </div>
            <span className="priority-count">{stats.byPriority.medium}</span>
          </div>
          <div className="priority-bar">
            <span className="priority-label high">高</span>
            <div className="bar-container">
              <div
                className="bar high"
                style={{
                  width:
                    stats.total > 0
                      ? `${(stats.byPriority.high / stats.total) * 100}%`
                      : '0%',
                }}
              />
            </div>
            <span className="priority-count">{stats.byPriority.high}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export const TodoStatsWithSubscribe = () => {
  const stats = useTodoStats()

  useEffect(() => {
    if (stats.total > 0 && stats.completed === stats.total) {
      console.log('🎉 所有任务已完成！')
    }
  }, [stats.completed, stats.total])

  return (
    <div className="todo-stats">
      <div className="stat-card">
        <div className="stat-value">{stats.total}</div>
        <div className="stat-label">总任务</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{stats.completed}</div>
        <div className="stat-label">已完成</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{stats.pending}</div>
        <div className="stat-label">待完成</div>
      </div>
    </div>
  )
}

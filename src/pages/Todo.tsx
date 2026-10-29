import { TodoApp } from '../components/Todo'
import './Todo.css'

const todoHighlights = [
  '表单新增与筛选联动',
  '派生统计与优先级分布',
  '局部订阅减少重复渲染',
  '更接近真实应用的状态组织',
]

const todoOverviewCards = [
  {
    title: '它不只是一个 demo',
    description:
      'Todo 页用更完整的交互流程把 Zustand 的状态组织方式串起来，比首页更接近真实项目里的 store 使用方式。',
  },
  {
    title: '一边操作，一边观察派生状态',
    description:
      '新增、筛选、完成和删除任务时，列表、统计和过滤条件会同步变化，适合观察订阅粒度和状态流转。',
  },
  {
    title: '界面也需要像首页一样有秩序',
    description:
      '这次把 Todo 页改成和首页一致的分区式布局，让表单、统计、筛选和列表的层级关系更清楚。',
  },
]

const todoFlow = [
  '先在左侧新增任务，建立数据样本',
  '再用筛选区测试搜索、优先级和状态组合',
  '最后观察统计区和列表是否跟着即时变化',
]

export const Todo = () => {
  return (
    <main className="container todo-page">
      <section className="todo-page__hero">
        <div className="todo-page__hero-content">
          <p className="todo-page__eyebrow">State In Action</p>
          <h1 className="todo-page__title">
            用一个 Todo 应用，
            <br />
            练习完整的状态流转
          </h1>
          <p className="todo-page__description">
            这里更像一个完整的 Zustand 练习场。你可以直接新增任务、组合筛选条件，再通过统计结果观察派生状态如何同步变化。
          </p>
          <div className="todo-page__chips">
            {todoHighlights.map((highlight) => (
              <span key={highlight} className="todo-page__chip">
                {highlight}
              </span>
            ))}
          </div>
        </div>

        <aside className="todo-page__panel">
          <p className="todo-page__panel-label">操作顺序</p>
          <h2 className="todo-page__panel-title">这页适合拿来观察一个完整 store 在 UI 中怎么工作</h2>
          <ol className="todo-page__panel-list">
            {todoFlow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </aside>
      </section>

      <section className="todo-page__overview">
        {todoOverviewCards.map((card) => (
          <article key={card.title} className="todo-page__overview-card">
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </article>
        ))}
      </section>

      <section className="todo-page__workspace">
        <div className="todo-page__section-heading">
          <p>Todo Workspace</p>
          <h2>保留功能完整度，把布局和层次整理得更清楚</h2>
          <span>
            左侧负责输入和统计，右侧负责过滤与结果展示，让操作路径和页面重心都更稳定。
          </span>
        </div>
        <TodoApp />
      </section>
    </main>
  )
}

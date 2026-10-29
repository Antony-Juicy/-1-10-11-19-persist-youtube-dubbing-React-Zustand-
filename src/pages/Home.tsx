import { CatBox } from '../components/CatBox'
import { CatBox2 } from '../components/CatBox2'
import { CatController } from '../components/CatController'
import { FoodBox } from '../components/FoodBox'
import Typewriters from '../components/Typewriter/TypingEffect'
import './Home.css'

const featureChips = [
  'Selector 精准订阅',
  'Shallow 减少重复渲染',
  'Store Action 组合更新',
  '异步 UI 展示',
]

const overviewCards = [
  {
    title: '为什么先看这些 Demo',
    description:
      '首页只保留最核心的几个例子，先把状态读取、局部订阅和 action 更新看明白，再进入更完整的页面。',
  },
  {
    title: '你会看到什么',
    description:
      '同一个 store 的不同读取方式、跨 store 状态联动，以及一个保留下来的异步打字机演示。',
  },
  {
    title: '怎么读这个页面',
    description:
      '从上到下看：先理解状态怎么被取出来，再观察交互后的渲染变化，最后看异步展示的表现。',
  },
]

const learningSteps = [
  '先看 CatBox 和 CatBox2 的状态读取差异',
  '再用 CatController 对比 action 组合写法',
  '最后通过 FoodBox 和 Typewriter 看联动与展示',
]

export const Home = () => {
  return (
    <main className="container home-page">
      <section className="home-hero">
        <div className="home-hero__content">
          <p className="home-hero__eyebrow">Zustand Fundamentals</p>
          <h1 className="home-hero__title">
            从共享状态开始，
            <br />
            理解 Zustand 的基础用法
          </h1>
          <p className="home-hero__description">
            这版首页继续保留你原来的核心示例，同时把阅读顺序、重点概念和演示区域重新整理，
            让页面在桌面端和移动端都更容易看。
          </p>
          <div className="home-hero__chips">
            {featureChips.map((chip) => (
              <span key={chip} className="home-hero__chip">
                {chip}
              </span>
            ))}
          </div>
        </div>

        <aside className="home-hero__panel">
          <p className="home-panel__label">学习顺序</p>
          <h2 className="home-panel__title">用一个页面串起 Zustand 的基本心智模型</h2>
          <ol className="home-panel__steps">
            {learningSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </aside>
      </section>

      <section className="home-overview">
        {overviewCards.map((card) => (
          <article key={card.title} className="home-overview__card">
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </article>
        ))}
      </section>

      <section className="home-demo-section">
        <div className="home-section-heading">
          <p>基础示例</p>
          <h2>直接观察不同订阅策略和更新方式</h2>
          <span>
            下面这组 demo 不改业务逻辑，只优化页面承载方式，让示例本身更容易比较。
          </span>
        </div>
        <div className="home-page__content">
          <CatBox />
          <CatBox2 />
          <CatController />
          <FoodBox />
        </div>
      </section>

      <section className="home-typewriter-section">
        <div className="home-section-heading">
          <p>异步展示</p>
          <h2>保留原有打字机演示，放到独立区域收尾</h2>
          <span>把示例和异步输出拆开后，首页节奏会更顺，也不会让内容挤在一起。</span>
        </div>
        <div className="home-typewriter-shell">
          <Typewriters />
        </div>
      </section>
    </main>
  )
}

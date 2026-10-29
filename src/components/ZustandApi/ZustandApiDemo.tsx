/* ***************************************************************************
 * Zustand 完整 API 演示组件
 *
 * 本组件展示 Zustand 所有核心 API 和中间件的实际使用效果
 * ***************************************************************************/

import { useEffect, useRef, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import './index.css'
import { AdvancedDemos } from './AdvancedDemos'

import {
  type CartItem,
  useBasicStore,
  useSetStore,
  useGetStore,
  useApiStore,
  useImmerStore,
  useDevtoolsStore,
  usePersistStore,
  useSelectorStore,
  useCombineStore,
  useShallowStore,
  useFullMiddlewareStore,
  useCount,
  useIncrement,
  useBasicActions,
} from '../../stores/apiStore'

interface SectionProps {
  number: string
  title: string
  description: string
  children: React.ReactNode
}

interface DemoGroupProps {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}

const Section = ({ number, title, description, children }: SectionProps) => (
  <article className="api-section">
    <div className="api-section-header">
      <div className="api-section-number">{number}</div>
      <div className="api-section-copy">
        <h3 className="api-section-title">{title}</h3>
        <p className="api-section-desc">{description}</p>
      </div>
    </div>
    <div className="demo-box">{children}</div>
  </article>
)

const DemoGroup = ({
  eyebrow,
  title,
  description,
  children,
}: DemoGroupProps) => (
  <section className="api-demo-group">
    <div className="api-demo-group__heading">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      <span>{description}</span>
    </div>
    <div className="api-cards-grid">{children}</div>
  </section>
)

export const CreateApiDemo = () => {
  const count = useBasicStore((state) => state.count)
  const increment = useBasicStore((state) => state.increment)
  const decrement = useBasicStore((state) => state.decrement)
  const reset = useBasicStore((state) => state.reset)

  return (
    <Section
      number="01"
      title="create() - 创建 Store"
      description="create() 是 Zustand 的核心函数，用于创建一个 store"
    >
      <div className="demo-values">
        <div>Count: {count}</div>
        <small>当前计数器值</small>
      </div>
      <div className="demo-buttons">
        <button onClick={decrement}>-</button>
        <button onClick={reset}>Reset</button>
        <button onClick={increment}>+</button>
      </div>
    </Section>
  )
}

export const SetApiDemo = () => {
  const value = useSetStore((state) => state.value)
  const text = useSetStore((state) => state.text)
  const { updateByObject, updateByFunction, replaceAll } = useSetStore()

  return (
    <Section
      number="02"
      title="set() - 更新状态"
      description="set() 用于更新 store 状态，支持对象和函数两种方式"
    >
      <div className="demo-values">
        <div>Value: {value}</div>
        <div>Text: {text}</div>
        <small>值和文本状态</small>
      </div>
      <div className="demo-buttons">
        <button onClick={updateByObject}>传入对象</button>
        <button onClick={updateByFunction}>传入函数</button>
        <button onClick={replaceAll}>替换全部</button>
      </div>
    </Section>
  )
}

export const GetApiDemo = () => {
  const items = useGetStore((state) => state.items)
  const addItem = useGetStore((state) => state.addItem)
  const getItemCount = useGetStore((state) => state.getItemCount)

  return (
    <Section
      number="03"
      title="get() - 获取状态"
      description="get() 在 action 中安全使用，返回当前状态快照"
    >
      <div className="demo-values">
        <div>Items: {items.join(', ') || '(empty)'}</div>
        <div>Count: {getItemCount()}</div>
        <small>项目列表和总数</small>
      </div>
      <div className="demo-buttons">
        <button onClick={() => addItem(`Item ${items.length + 1}`)}>
          添加项
        </button>
      </div>
    </Section>
  )
}

export const ApiParamDemo = () => {
  const count = useApiStore((state) => state.count)
  const increment = useApiStore((state) => state.increment)
  const getState = useApiStore((state) => state.getState)

  const [externalValue, setExternalValue] = useState<number | null>(null)

  return (
    <Section
      number="04"
      title="api 参数 - 底层 Store API"
      description="api 参数提供对 getState、setState、subscribe 等底层 API 的访问"
    >
      <div className="demo-values">
        <div>Store Count: {count}</div>
        <div>External: {externalValue ?? '(未获取)'}</div>
        <small>组件内值和外部获取的值</small>
      </div>
      <div className="demo-buttons">
        <button onClick={increment}>增加</button>
        <button onClick={() => setExternalValue(getState())}>getState()</button>
      </div>
    </Section>
  )
}

export const ImmerDemo = () => {
  const user = useImmerStore((state) => state.user)
  const products = useImmerStore((state) => state.products)
  const updateUserName = useImmerStore((state) => state.updateUserName)
  const addProduct = useImmerStore((state) => state.addProduct)

  return (
    <Section
      number="05"
      title="immer 中间件 - 简化不可变更新"
      description="像修改可变对象一样更新状态，不需要手动展开"
    >
      <div className="demo-values">
        <div>User: {user.name}</div>
        <div>Products: {products.length}</div>
        <small>用户名和产品数量</small>
      </div>
      <div className="demo-buttons">
        <button onClick={() => updateUserName('Alice')}>更新用户名</button>
        <button
          onClick={() =>
            addProduct({
              id: Date.now().toString(),
              name: `Product ${products.length + 1}`,
              price: Math.floor(Math.random() * 100),
              category: 'Demo',
              inStock: true,
            })
          }
        >
          添加产品
        </button>
      </div>
    </Section>
  )
}

export const DevtoolsDemo = () => {
  const logs = useDevtoolsStore((state) => state.logs)
  const addLog = useDevtoolsStore((state) => state.addLog)
  const clearLogs = useDevtoolsStore((state) => state.clearLogs)

  return (
    <Section
      number="06"
      title="devtools 中间件 - Redux DevTools 集成"
      description="在 Redux DevTools 中查看状态变化（按 F12 -> Redux 标签）"
    >
      <div className="demo-values">
        <div className="logs-container">
          {logs.length === 0 ? '(暂无日志)' : logs.join('\n')}
        </div>
      </div>
      <div className="demo-buttons">
        <button onClick={() => addLog('操作 1')}>添加日志</button>
        <button onClick={() => addLog('操作 2')}>添加日志</button>
        <button onClick={clearLogs}>清空</button>
      </div>
    </Section>
  )
}

export const PersistDemo = () => {
  const settings = usePersistStore((state) => state.settings)
  const updateTheme = usePersistStore((state) => state.updateTheme)
  const updateLanguage = usePersistStore((state) => state.updateLanguage)

  return (
    <Section
      number="07"
      title="persist 中间件 - 状态持久化"
      description="状态自动保存到 localStorage，刷新页面后仍然存在"
    >
      <div className="demo-values">
        <div>Theme: {settings.theme}</div>
        <div>Language: {settings.language}</div>
        <small>刷新页面验证持久化效果</small>
      </div>
      <div className="demo-buttons">
        <button onClick={() => updateTheme('light')}>Light</button>
        <button onClick={() => updateTheme('dark')}>Dark</button>
        <button onClick={() => updateLanguage('zh-CN')}>中文</button>
        <button onClick={() => updateLanguage('en-US')}>English</button>
      </div>
    </Section>
  )
}

export const SelectorDemo = () => {
  const count1 = useSelectorStore((state) => state.count1)
  const count2 = useSelectorStore((state) => state.count2)
  const increment1 = useSelectorStore((state) => state.increment1)
  const increment2 = useSelectorStore((state) => state.increment2)

  const [subscribedValue, setSubscribedValue] = useState<number | null>(null)

  useEffect(() => {
    const unsubscribe = useSelectorStore.subscribe(
      (state) => state.count1,
      setSubscribedValue,
      { fireImmediately: true }
    )

    return unsubscribe
  }, [])

  return (
    <Section
      number="08"
      title="subscribeWithSelector - 订阅特定状态"
      description="订阅状态的一部分，只在变化时触发回调"
    >
      <div className="demo-values">
        <div>Count1: {count1}</div>
        <div>Count2: {count2}</div>
        <div>Subscribed Count1: {subscribedValue ?? '(等待变化)'}</div>
        <small>两个计数器和订阅回调的值</small>
      </div>
      <div className="demo-buttons">
        <button onClick={increment1}>Count1 +1</button>
        <button onClick={increment2}>Count2 +1</button>
      </div>
    </Section>
  )
}

export const CombineDemo = () => {
  const count = useCombineStore((state) => state.count)
  const name = useCombineStore((state) => state.name)
  const increment = useCombineStore((state) => state.increment)
  const setName = useCombineStore((state) => state.setName)

  return (
    <Section
      number="09"
      title="combine 中间件 - 类型安全初始状态"
      description="从初始状态推断类型，更好的 TypeScript 支持"
    >
      <div className="demo-values">
        <div>Count: {count}</div>
        <div>Name: {name}</div>
        <small>计数器和名称</small>
      </div>
      <div className="demo-buttons">
        <button onClick={increment}>+</button>
        <button onClick={() => setName('Bob')}>设置 Bob</button>
        <button onClick={() => setName('Alice')}>设置 Alice</button>
      </div>
    </Section>
  )
}

const SelectedFields = () => {
  const [count, name] = useShallowStore(
    useShallow((state) => [state.count, state.name] as const)
  )
  const renderCount = useRef(0)
  renderCount.current += 1
  return <div className="demo-values">
    <div>Count: {count}</div>
    <div>Name: {name}</div>
    <div className="render-count">字段面板渲染: {renderCount.current}</div>
    <small>仅订阅 count 和 name。切换 Active 时，此面板的渲染计数保持不变。开发模式可能额外调用渲染。</small>
  </div>
}

const ActiveControl = () => {
  const active = useShallowStore((state) => state.active)
  const toggleActive = useShallowStore((state) => state.toggleActive)
  return <button onClick={toggleActive}>切换 Active：{active ? '开启' : '关闭'}</button>
}

export const ShallowDemo = () => {
  const increment = useShallowStore((state) => state.increment)

  return (
    <Section
      number="10"
      title="useShallow - 比较订阅范围"
      description="两个区域分别订阅字段，观察无关状态更新对渲染的影响"
    >
      <SelectedFields />
      <div className="demo-buttons">
        <button onClick={increment}>Count +1</button>
        <ActiveControl />
      </div>
    </Section>
  )
}

export const FullMiddlewareDemo = () => {
  const user = useFullMiddlewareStore((state) => state.user)
  const cart = useFullMiddlewareStore((state) => state.cart)
  const addToCart = useFullMiddlewareStore((state) => state.addToCart)
  const removeFromCart = useFullMiddlewareStore((state) => state.removeFromCart)
  const clearCart = useFullMiddlewareStore((state) => state.clearCart)
  const updateUser = useFullMiddlewareStore((state) => state.updateUser)

  const total = cart.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  )

  return (
    <Section
      number="11"
      title="完整中间件组合"
      description="组合使用 immer、devtools、subscribeWithSelector、persist"
    >
      <div className="demo-values">
        <div>
          User: {user.name} ({user.role})
        </div>
        <div>Cart Items: {cart.length}</div>
        <div>Total: ${total}</div>
        <small>用户、购物车和总价</small>
      </div>
      <div className="demo-buttons">
        <button
          onClick={() =>
            addToCart({
              id: Date.now().toString(),
              name: 'Apple',
              price: 5,
              category: 'Fruit',
              inStock: true,
            })
          }
        >
          添加 Apple ($5)
        </button>
        <button onClick={() => cart.length > 0 && removeFromCart(cart[0].id)}>
          移除第一项
        </button>
        <button onClick={clearCart}>清空购物车</button>
        <button onClick={() => updateUser({ role: 'admin' })}>
          设置为管理员
        </button>
      </div>
    </Section>
  )
}

export const CustomHooksDemo = () => {
  const count = useCount()
  const increment = useIncrement()
  const { decrement, reset } = useBasicActions()
  const renderCount = useRef(0)
  renderCount.current += 1

  return (
    <Section
      number="12"
      title="自定义 Hooks"
      description="封装常用的选择器，代码更简洁，性能更好"
    >
      <div className="demo-values">
        <div>Count: {count}</div>
        <div>useCount 渲染: {renderCount.current} 次</div>
        <small>订阅 count 的组件会更新；只订阅稳定 action 的组件不会因 count 更新。</small>
      </div>
      <div className="demo-buttons">
        <button onClick={decrement}>-</button>
        <button onClick={reset}>Reset</button>
        <button onClick={increment}>+</button>
      </div>
    </Section>
  )
}

export const ZustandApiDemo = () => {
  return (
    <div className="zustand-api-demo">
      <AdvancedDemos />
      <DemoGroup
        eyebrow="Core APIs"
        title="从最基础的创建、读取和更新开始"
        description="先把 store 的创建方式和数据更新方式看明白，再去理解后面的增强能力。"
      >
        <CreateApiDemo />
        <SetApiDemo />
        <GetApiDemo />
        <ApiParamDemo />
      </DemoGroup>

      <DemoGroup
        eyebrow="Middleware"
        title="把调试、持久化和订阅增强串进同一套心智模型"
        description="这一组更适合边操作边看页面反馈，理解 Zustand 为什么在中小型应用里非常灵活。"
      >
        <ImmerDemo />
        <DevtoolsDemo />
        <PersistDemo />
        <SelectorDemo />
      </DemoGroup>

      <DemoGroup
        eyebrow="Advanced Patterns"
        title="最后看组合模式、性能优化和自定义 hooks"
        description="把 selector、shallow 和 hooks 组合起来后，Zustand 的可维护性会更明显。"
      >
        <CombineDemo />
        <ShallowDemo />
        <FullMiddlewareDemo />
        <CustomHooksDemo />
      </DemoGroup>
    </div>
  )
}

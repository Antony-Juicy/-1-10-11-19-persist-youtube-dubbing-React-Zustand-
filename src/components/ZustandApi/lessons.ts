import type { ComponentType } from 'react'
import { CreateApiDemo, SetApiDemo, GetApiDemo, ApiParamDemo, ImmerDemo, DevtoolsDemo, PersistDemo, SelectorDemo, CombineDemo, ShallowDemo, FullMiddlewareDemo, CustomHooksDemo } from './ZustandApiDemo'
import { AdvancedDemos } from './AdvancedDemos'

export interface Lesson {
  id: string
  group: string
  title: string
  api: string
  purpose: string
  steps: string[]
  takeaway: string
  code: string
  demos: ComponentType[]
}

export const lessons: Lesson[] = [
  {
    id: 'create', group: '01 / 基础', title: '共享一个状态', api: 'create · selector',
    purpose: '多个组件需要读取和修改同一个值时，把状态和操作一起放进 store。组件只订阅自己需要的字段。',
    steps: ['点击 + 或 −，观察计数变化。', '点击 Reset 回到初始计数。'],
    takeaway: 'store 在组件外创建。selector 决定组件订阅什么；action 负责更新。',
    code: `import { create } from 'zustand'

const useCounter = create<{
  count: number
  increment: () => void
}>()((set) => ({
  count: 0,
  increment: () => set(s => ({ count: s.count + 1 })),
}))

function Counter() {
  const count = useCounter(s => s.count)
  const increment = useCounter(s => s.increment)
  return <button onClick={increment}>{count}</button>
}`, demos: [CreateApiDemo],
  },
  {
    id: 'update', group: '01 / 基础', title: '安全更新与读取', api: 'set · get · getState',
    purpose: '更新依赖旧值时使用函数式 set；需要读取调用时的状态时使用 get 或 getState。',
    steps: ['依次点击“传入对象”“传入函数”。', '点击“替换全部”，再点“传入函数”，操作仍可继续。', '获取一次 External 快照，再增加计数，比较两个值。'],
    takeaway: 'set 默认只做浅合并。replace=true 会替换整个状态，必须保留 action。getState 不建立订阅。',
    code: `// 合并更新：保留其他字段
store.setState({ value: 10 })
store.setState(s => ({ value: s.value + 1 }))

// 完整替换：保留操作函数
store.setState(s => ({ ...s, value: 100, text: 'replaced' }), true)

// 快照，不随之后的更新自动变化
const snapshot = store.getState()

// 回到完整初始状态
store.setState(store.getInitialState(), true)`, demos: [SetApiDemo, GetApiDemo, ApiParamDemo],
  },
  {
    id: 'subscribe', group: '02 / 订阅', title: '只关心需要的变化', api: 'subscribeWithSelector · useShallow',
    purpose: '在 React 中稳定地选择多个字段；在组件外只监听目标字段，例如把计数同步给其他系统。',
    steps: ['增加 Count2，Subscribed Count1 保持不变。', '增加 Count1，订阅结果同步更新。', '切换 Active，字段面板渲染计数不变；点击 Count +1，计数增加。'],
    takeaway: 'useShallow 稳定浅相等的选择结果。subscribeWithSelector 用于 store 监听，两者作用位置不同。',
    code: `import { useShallow } from 'zustand/react/shallow'

const [count, name] = useStore(
  useShallow(s => [s.count, s.name] as const)
)

useEffect(() => {
  return store.subscribe(
    s => s.count1,
    count => setSubscribedValue(count),
    { fireImmediately: true },
  ) // effect 返回取消订阅函数
}, [])`, demos: [SelectorDemo, ShallowDemo],
  },
  {
    id: 'persist', group: '03 / 中间件', title: '刷新后继续使用', api: 'persist · createJSONStorage',
    purpose: '保存主题、语言和用户偏好。用 partialize 明确哪些字段需要落盘。',
    steps: ['选择 Dark 或 English。', '刷新当前页面，确认选项恢复。', '在“独立实例与生命周期”中体验清除存储与重新恢复。'],
    takeaway: 'clearStorage 仅清除磁盘记录。异步存储需要考虑 hydration；数据结构变化时使用 version/migrate。',
    code: `import { persist, createJSONStorage } from 'zustand/middleware'

const useSettings = create<Settings>()(persist(
  set => ({
    theme: 'light',
    setTheme: theme => set({ theme }),
  }),
  {
    name: 'settings',
    storage: createJSONStorage(() => localStorage),
    partialize: s => ({ theme: s.theme }),
  },
))

await useSettings.persist.rehydrate()
useSettings.persist.hasHydrated()`, demos: [PersistDemo],
  },
  {
    id: 'nested', group: '03 / 中间件', title: '处理嵌套对象', api: 'immer · devtools',
    purpose: '更新用户资料或数组条目时，immer 简化不可变更新；devtools 帮你追踪每次更新。',
    steps: ['更新用户名，再添加产品。', '添加日志，观察记录。', '安装 Redux DevTools 扩展后可进一步查看 store 状态。'],
    takeaway: '只有在 immer 的 set 回调内使用修改式写法。不要直接修改 getState() 返回的数据。',
    code: `import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'

const useProfile = create<Profile>()(
  devtools(immer(set => ({
    user: { name: 'Alice' },
    rename: name => set(state => {
      state.user.name = name
    }, false, 'profile/rename'),
  })), { name: 'profile' }),
)`, demos: [ImmerDemo, DevtoolsDemo],
  },
  {
    id: 'compose', group: '04 / 组织方式', title: '组合业务与 Hooks', api: 'combine · custom hooks · middleware',
    purpose: '用 combine 推断初始状态类型，用自定义 hook 提供清楚的组件接口，再把多个中间件应用到实际购物车。',
    steps: ['修改名称和计数。', '向购物车添加商品，观察数量与总价。', '删除或清空商品，观察派生总价。'],
    takeaway: '自定义 hook 封装订阅方式；它不会创建新 store。购物车总价由数据计算，不额外存一份。',
    code: `import { combine } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'

const useCounter = create(combine(
  { count: 0, name: 'John' },
  set => ({ increment: () => set(s => ({ count: s.count + 1 })) }),
))

export const useCount = () => useCounter(s => s.count)
export const useActions = () => useCounter(
  useShallow(s => ({ increment: s.increment }))
)`, demos: [CombineDemo, FullMiddlewareDemo, CustomHooksDemo],
  },
  {
    id: 'instances', group: '04 / 组织方式', title: '独立实例与生命周期', api: 'createStore · useStore · traditional · redux',
    purpose: '同一页面的多个部件需要各自的状态时，通过工厂创建 vanilla store，再用 React hook 连接。',
    steps: ['增加第一个计数，确认第二个不变。', '重置实例，回到创建时的状态。', '尝试 dispatch 和持久化恢复控制。'],
    takeaway: 'createStore 返回普通 store；useStore 负责 React 订阅。自定义相等函数使用 traditional 入口。',
    code: `import { createStore } from 'zustand/vanilla'
import { useStore } from 'zustand'

const createCounter = () => createStore(() => ({ count: 0 }))

function CounterInstance() {
  const [store] = useState(createCounter)
  const count = useStore(store, s => s.count)
  return <button onClick={() =>
    store.setState(s => ({ count: s.count + 1 }))
  }>{count}</button>
}

// subscribe 返回清理函数；v5 不再提供 destroy。
const unsubscribe = store.subscribe(listener)
unsubscribe()`, demos: [AdvancedDemos],
  },
]

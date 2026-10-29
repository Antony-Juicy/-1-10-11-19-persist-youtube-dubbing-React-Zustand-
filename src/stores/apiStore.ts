/* ***************************************************************************
 * Zustand 完整 API 演示 Store
 *
 * 本文件包含 Zustand 所有核心 API 和中间件的用法演示
 * ***************************************************************************/

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools, persist, subscribeWithSelector, createJSONStorage } from 'zustand/middleware'
import { combine } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'

// =============================================================================
// 类型定义
// =============================================================================

export type UserRole = 'guest' | 'user' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export interface Product {
  id: string
  name: string
  price: number
  category: string
  inStock: boolean
}

export interface CartItem extends Product {
  quantity: number
}

// =============================================================================
// 1. create() - 核心 API：创建 store
// =============================================================================

/**
 * create() 是 Zustand 的核心函数，用于创建一个 store
 *
 * @template TState - 状态类型
 * @returns StoreApi<TState> & UseBoundStore<StoreApi<TState>>
 *
 * 用法：
 * - create<TState>(initializer)
 * - create<TState>()(initializer) // 推荐的泛型写法
 *
 * 参数 initializer 接收 (set, get, api) 三个参数：
 * - set: 更新状态的方法
 * - get: 获取当前状态的方法
 * - api: store 的底层 API
 */

// 方式一：基础创建（无中间件）
export const useBasicStore = create<{
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))

// =============================================================================
// 2. set() - 更新状态
// =============================================================================

/**
 * set() 用于更新 store 状态
 *
 * 签名: set(partial, replace?)
 *
 * 参数说明：
 * - partial: 新的部分状态（对象 或 返回对象的函数）
 * - replace: 是否替换整个状态（默认 false，即合并更新）
 *
 * @example
 * set({ count: 5 })                    // 合并更新
 * set(store.getInitialState(), true)  // 用完整初始状态替换（包含 action）
 * set((state) => ({ count: state.count + 1 }))  // 函数式更新
 */

// 演示 set() 的不同用法
export const useSetStore = create<{
  value: number
  text: string
  updateByObject: () => void         // 方式1: 传入对象
  updateByFunction: () => void        // 方式2: 传入函数
  replaceAll: () => void             // 方式3: 替换整个状态
}>((set) => ({
  value: 0,
  text: 'hello',
  updateByObject: () =>
    set({ value: 10 }), // 直接传入对象，合并更新
  updateByFunction: () =>
    set((state) => ({ value: state.value + 1 })), // 传入函数，基于当前状态计算
  replaceAll: () =>
    set((state) => ({ ...state, value: 100, text: 'replaced' }), true), // 完整替换必须保留 action
}))

// =============================================================================
// 3. get() - 获取状态（响应式/非响应式）
// =============================================================================

/**
 * get() 用于获取当前状态的值
 *
 * 注意：get() 返回的是当前时刻的状态快照
 * - 在 action 中使用：读取调用时的快照，不建立订阅
 * - 在组件外部使用：非响应式（不会触发组件重新渲染）
 *
 * @example
 * const currentValue = get().count
 */

export const useGetStore = create<{
  items: string[]
  addItem: (item: string) => void
  getItemCount: () => number          // 在 action 中使用 get()
}>((set, get) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({ items: [...state.items, item] })),
  // 在 action 中使用 get() - 这是安全的，因为 action 在状态变化时被调用
  getItemCount: () => get().items.length,
}))

// =============================================================================
// 4. api - 获取底层 store API
// =============================================================================

/**
 * api 参数提供对底层 StoreApi 的访问
 *
 * 可用方法：
 * - api.getState()   - 获取当前状态（非响应式）
 * - api.setState()    - 设置状态
 * - api.subscribe()   - 订阅状态变化
 * - api.getInitialState() - 获取创建时的初始状态
 *
 * @example
 * create((set, get, api) => {
 *   api.subscribe(console.log) // 订阅所有状态变化
 *   return initialState
 * })
 */

export const useApiStore = create<{
  count: number
  increment: () => void
  getState: () => number
}>((set, _get, api) => {
  return {
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    getState: () => api.getState().count,
  }
})

// =============================================================================
// 5. immer 中间件 - 简化不可变更新
// =============================================================================

/**
 * immer 中间件允许你像修改可变对象一样更新状态
 *
 * 优势：
 * - 不需要手动展开嵌套对象 (...state)
 * - 代码更简洁，不易出错
 * - 性能更好（immer 内部优化）
 *
 * @example
 * // 不使用 immer
 * set((state) => ({
 *   user: { ...state.user, name: 'new name' }
 * }))
 *
 * // 使用 immer
 * set((state) => { state.user.name = 'new name' })
 */

export const useImmerStore = create<{
  user: User
  products: Product[]
  updateUserName: (name: string) => void
  addProduct: (product: Product) => void
  updateProductPrice: (id: string, price: number) => void
}>()(
  immer((set) => ({
    user: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
    },
    products: [],
    updateUserName: (name) =>
      set((state) => {
        // 直接修改，immer 处理不可变性
        state.user.name = name
      }),
    addProduct: (product) =>
      set((state) => {
        state.products.push(product)
      }),
    updateProductPrice: (id, price) =>
      set((state) => {
        const product = state.products.find((p) => p.id === id)
        if (product) {
          product.price = price // 嵌套修改
        }
      }),
  }))
)

// =============================================================================
// 6. devtools 中间件 - Redux DevTools 集成
// =============================================================================

/**
 * devtools 中间件将 Zustand 集成到 Redux DevTools
 *
 * 配置选项：
 * - name: 显示在 DevTools 中的名称
 * - enabled: 是否启用（开发环境默认启用）
 *
 * @example
 * devtools(storeCreator, { name: 'my-store', enabled: true })
 */

export const useDevtoolsStore = create<{
  logs: string[]
  addLog: (message: string) => void
  clearLogs: () => void
}>()(
  devtools(
    (set) => ({
      logs: [],
      addLog: (message) =>
        set((state) => ({
          logs: [...state.logs, `${new Date().toISOString()}: ${message}`],
        })),
      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: 'devtools-store', // DevTools 中显示的名称
      enabled: true, // 是否启用
    }
  )
)

// =============================================================================
// 7. persist 中间件 - 状态持久化
// =============================================================================

/**
 * persist 中间件将状态持久化到存储（默认 localStorage）
 *
 * 配置选项：
 * - name: 存储的 key 名称
 * - storage: 自定义存储（默认 localStorage）
 * - partialize: 选择要持久化的部分状态
 * - version: 版本号（用于迁移）
 * - migrate: 版本迁移函数
 *
 * @example
 * persist(storeCreator, {
 *   name: 'my-storage',
 *   partialize: (state) => ({ user: state.user })
 * })
 */

export const usePersistStore = create<{
  settings: {
    theme: 'light' | 'dark'
    language: 'zh-CN' | 'en-US'
  }
  userProfile: {
    name: string
    age: number
  }
  temporaryData: string[] // 不会被持久化
  updateTheme: (theme: 'light' | 'dark') => void
  updateLanguage: (language: 'zh-CN' | 'en-US') => void
  updateName: (name: string) => void
  addTemporaryData: (data: string) => void
}>()(
  persist(
    (set) => ({
      settings: {
        theme: 'light',
        language: 'zh-CN',
      },
      userProfile: {
        name: 'Guest',
        age: 0,
      },
      temporaryData: [],
      updateTheme: (theme) =>
        set((state) => ({
          settings: { ...state.settings, theme },
        })),
      updateLanguage: (language) =>
        set((state) => ({
          settings: { ...state.settings, language },
        })),
      updateName: (name) =>
        set((state) => ({
          userProfile: { ...state.userProfile, name },
        })),
      addTemporaryData: (data) =>
        set((state) => ({
          temporaryData: [...state.temporaryData, data],
        })),
    }),
    {
      name: 'persist-store', // localStorage 的 key
      storage: createJSONStorage(() => localStorage),

      // partialize: 只持久化部分状态
      partialize: (state) => ({
        settings: state.settings,
        userProfile: state.userProfile,
        // temporaryData 不会被持久化
      }),

      // storage: 自定义存储（可选）
      // storage: createJSONStorage(() => sessionStorage),

      // version: 版本号（用于数据迁移）
      // version: 1,

      // migrate: 版本迁移函数
      // migrate: (persistedState, version) => {
      //   if (version === 0) {
      //     // 迁移到版本 1
      //     return { ...persistedState, newField: 'default' }
      //   }
      //   return persistedState
      // },
    }
  )
)

// =============================================================================
// 8. subscribeWithSelector 中间件 - 订阅特定状态
// =============================================================================

/**
 * subscribeWithSelector 允许订阅状态的一部分而非整个状态
 *
 * 优势：
 * - 只在订阅的状态变化时触发回调
 * - 支持 selector 语法
 * - 支持 equalityFn 比较函数
 *
 * @example
 * useStore.subscribe(
 *   (state) => state.count,  // selector
 *   (count) => console.log(count)  // callback
 * )
 */

export const useSelectorStore = create<{
  count1: number
  count2: number
  text: string
  increment1: () => void
  increment2: () => void
  setText: (text: string) => void
}>()(
  subscribeWithSelector(
    devtools(
      (set) => ({
        count1: 0,
        count2: 0,
        text: '',
        increment1: () => set((state) => ({ count1: state.count1 + 1 })),
        increment2: () => set((state) => ({ count2: state.count2 + 1 })),
        setText: (text) => set({ text }),
      }),
      { name: 'selector-store' }
    )
  )
)

// =============================================================================
// 9. combine 中间件 - 类型安全的初始状态
// =============================================================================

/**
 * combine 中间件用于创建带有类型安全初始状态的 store
 *
 * 优势：
 * - 初始状态推断类型
 * - 更好的 TypeScript 支持
 *
 * @example
 * combine(initialState, (set, get) => ({ actions }))
 */

const initialState = {
  count: 0,
  name: 'John',
}

export const useCombineStore = create(
  combine(initialState, (set) => ({
    increment: () => set((state) => ({ count: state.count + 1 })),
    setName: (name: string) => set({ name }),
  }))
)

// =============================================================================
// 10. shallow - 浅比较优化
// =============================================================================

/**
 * shallow 函数用于浅比较对象，避免不必要的重新渲染
 *
 * 使用场景：订阅多个状态时
 *
 * @example
 * const [count, name] = useStore(useShallow((state) => [state.count, state.name]))
 */

export const useShallowStore = create<{
  count: number
  name: string
  active: boolean
  increment: () => void
  toggleActive: () => void
}>((set) => ({
  count: 0,
  name: 'Demo',
  active: false,
  increment: () => set((state) => ({ count: state.count + 1 })),
  toggleActive: () => set((state) => ({ active: !state.active })),
}))

// =============================================================================
// 11. 完整中间件组合示例
// =============================================================================

/**
 * 中间件可以组合使用，顺序很重要
 * 各中间件保留自己的类型扩展；实际组合顺序见下方示例。
 */

interface FullState {
  user: User
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  updateUser: (updates: Partial<User>) => void
}

export const useFullMiddlewareStore = create<FullState>()(
  immer(
    devtools(
      subscribeWithSelector(
        persist(
          (set) => ({
            user: {
              id: '1',
              name: 'John Doe',
              email: 'john@example.com',
              role: 'user',
            },
            cart: [],
            addToCart: (product: Product) =>
              set((state) => {
                const existingItem = state.cart.find((item: CartItem) => item.id === product.id)
                if (existingItem) {
                  existingItem.quantity++
                } else {
                  state.cart.push({ ...product, quantity: 1 })
                }
              }),
            removeFromCart: (productId: string) =>
              set((state) => {
                state.cart = state.cart.filter((item: CartItem) => item.id !== productId)
              }),
            clearCart: () => set({ cart: [] }),
            updateUser: (updates: Partial<User>) =>
              set((state) => {
                Object.assign(state.user, updates)
              }),
          }),
          {
            name: 'full-middleware-store',
            partialize: (state) => ({
              user: state.user,
              cart: state.cart,
            }),
          }
        )
      )
    )
  )
)

// =============================================================================
// 12. 订阅相关 API
// =============================================================================

// subscribe() - 订阅状态变化
// unsubscribe = store.subscribe((state, prevState) => {})
// unsubscribe() - 取消订阅

// subscribeWithSelector - 带选择器的订阅
// store.subscribe(selector, callback, options?)
// options: { equalityFn, fireImmediately }

// =============================================================================
// 13. 外部 API（非组件内使用）
// =============================================================================

/**
 * 在组件外部使用 store 的方法
 *
 * - getState(): 获取当前状态（非响应式）
 * - setState(partial): 更新状态
 * - subscribe(): 订阅状态变化
 * - getInitialState(): 获取创建时的初始状态
 *
 * @example
 * // 获取状态
 * const state = useStore.getState()
 *
 * // 更新状态
 * useStore.setState({ count: 10 })
 *
 * // 订阅
 * const unsubscribe = useStore.subscribe(...)
 * unsubscribe()
 *
 * // 完整重置（包含 action）
 * useStore.setState(useStore.getInitialState(), true)
 */

// 外部 action 示例
export const externalActions = {
  increment: () => useBasicStore.getState().increment(),
  getCount: () => useBasicStore.getState().count,
  reset: () => useBasicStore.setState({ count: 0 }),
}

// =============================================================================
// 14. 自定义 Hooks 模式
// =============================================================================

/**
 * 创建自定义 hooks 封装常用的选择器
 * 优势：
 * - 组件中使用更简洁
 * - 类型安全
 * - 复用性好
 */

// 订阅单个值
export const useCount = () => useBasicStore((state) => state.count)
export const useIncrement = () => useBasicStore((state) => state.increment)

// 订阅多个值（使用 shallow）
export const useShallowCountName = () =>
  useShallowStore(
    useShallow((state) => [state.count, state.name] as const)
  )

// 订阅计算值
export const useItemCount = () =>
  useGetStore((state) => state.getItemCount())

// 订阅所有 actions
export const useBasicActions = () =>
  useBasicStore(useShallow((state) => ({
    increment: state.increment,
    decrement: state.decrement,
    reset: state.reset,
  })))

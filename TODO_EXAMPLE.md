# Zustand 完整使用案例 - Todo 应用

这是一个完整的 Todo 应用示例，展示 Zustand 状态管理的各种功能和最佳实践。

## 📁 文件结构

```
src/
├── stores/
│   └── todoStore.ts       # 核心 Store 定义
├── components/Todo/
│   ├── index.tsx          # 主应用组件
│   ├── index.css          # 样式文件
│   ├── TodoForm.tsx       # 新建任务表单
│   ├── TodoList.tsx       # 任务列表
│   ├── TodoItem.tsx       # 单个任务项
│   ├── TodoFilter.tsx     # 过滤器
│   └── TodoStats.tsx      # 统计信息
```

## 🎯 功能特性

### 1. 基础 CRUD 操作
- ✅ 添加任务
- ✅ 更新任务
- ✅ 删除任务
- ✅ 切换完成状态

### 2. 高级功能
- 🔍 搜索过滤
- 🏷️ 优先级过滤 (低/中/高)
- 📊 状态过滤 (待办/进行中/已完成)
- 📈 统计信息展示
- 💾 状态持久化
- 🛠️ Redux DevTools 集成

## 📖 Zustand 核心概念演示

### 1. Store 创建

```typescript
// 使用多个中间件
export const useTodoStore = create<TodoStoreState>()(
  immer(
    devtools(
      subscribeWithSelector(
        persist(
          (set, get) => ({
            // state
            // actions
          }),
          { name: 'todo store' }
        )
      ),
      { name: 'todo store', enabled: true }
    )
  )
)
```

### 2. 中间件使用

| 中间件 | 作用 |
|--------|------|
| `immer` | 简化不可变状态更新 |
| `devtools` | Redux DevTools 集成 |
| `subscribeWithSelector` | 支持订阅特定状态 |
| `persist` | 状态持久化到 localStorage |

### 3. 状态订阅方式

#### 方式一：订阅整个 state（不推荐，会导致不必要渲染）
```typescript
const { todos, addTodo } = useTodoStore()
```

#### 方式二：使用 selector（推荐）
```typescript
const todos = useTodoStore((state) => state.todos)
const addTodo = useTodoStore((state) => state.addTodo)
```

#### 方式三：使用 selector + shallow（订阅多个状态）
```typescript
const [todos, addTodo] = useTodoStore(
  (state) => [state.todos, state.addTodo],
  shallow
)
```

#### 方式四：使用自定义 hook（最佳实践）
```typescript
const todos = useFilteredTodos()  // 订阅过滤后的列表
const stats = useTodoStats()      // 订阅统计信息
```

### 4. 计算属性（Derived State）

```typescript
getFilteredTodos: () => Todo[],
getStats: () => { total, completed, pending, byPriority }
```

计算属性不在 store 中存储，而是通过 getter 方法动态计算。

### 5. 外部 Action

可以在组件外部直接调用 store 的方法：

```typescript
// 定义外部 action
export const addTodo = (title: string, description: string, priority: Priority) => {
  useTodoStore.getState().addTodo(title, description, priority)
}

// 在任何地方调用
addTodo('完成文档', '', 'high')
```

### 6. 订听状态变化

```typescript
useEffect(() => {
  const unsubscribe = useTodoStore.subscribe(
    (state) => state.todos,
    (todos) => {
      console.log('Todos changed:', todos.length)
    }
  )
  return unsubscribe
}, [])

// 使用 subscribeWithSelector 订阅特定字段
useTodoStore.subscribe(
  (state) => state.todos.filter(t => t.completed).length,
  (completedCount) => {
    if (completedCount > 10) {
      console.log('Great job!')
    }
  }
)
```

### 7. 非 React 环境获取状态

```typescript
// 使用 getState() 非响应式读取（不触发重渲染）
const currentTodos = useTodoStore.getState().todos

// 使用 setState() 外部更新状态
useTodoStore.setState({ filter: initialFilter })
```

## 🎨 组件说明

| 组件 | 展示的 Zustand 概念 |
|------|---------------------|
| `TodoForm` | 使用 hooks 获取 action |
| `TodoFilter` | 订阅 filter 状态 |
| `TodoList` | 使用 `shallow` 订阅多个状态 |
| `TodoItem` | 单个组件只订阅必要的数据 |
| `TodoStats` | 订阅计算属性（派生状态） |

## 🚀 运行项目

```bash
npm install
npm run dev
```

访问 http://localhost:5173

## 📝 最佳实践总结

1. ✅ **优先使用 selector** 订阅特定状态，避免不必要渲染
2. ✅ **使用 shallow** 比较多个状态时
3. ✅ **封装自定义 hooks** 封装常用的选择器
4. ✅ **计算属性用 getter** 而非存储在 state 中
5. ✅ **immer 中间件** 处理嵌套状态更新
6. ✅ **外部 action** 用于跨组件调用
7. ⚠️ **避免直接解构** 整个 store
8. ⚠️ **谨慎使用 getState()** 它不会触发重渲染

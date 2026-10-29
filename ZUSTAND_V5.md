# Zustand v5 示例索引

本项目升级到 Zustand 5.0.16（本次 npm latest），保留 React 18。使用 npm 和 package-lock.json 安装；仓库遗留的 yarn/pnpm 锁文件尚未同步，勿混用。

## 阅读顺序

API 页采用场景目录：搜索 API 或场景，选择主题后对照交互演示、核心写法和实际 Store 源码。主题通过 ?lesson= 保存到 URL，支持刷新和直接分享链接。核心写法是教学片段，完整实现见 Store 源码视图。

1. 首页：单字段订阅、自动 selector、useShallow 多字段订阅、组件外 setState。
2. API 页：核心方法、中间件、独立实例、相等比较与持久化控制。
3. Todo：类型化数据和 action，纯函数派生数据，稳定订阅，localStorage 持久化。

## 公共 API 覆盖

| 官方 Reference | 示例位置 |
| --- | --- |
| create；set/get；getState/setState/subscribe/getInitialState | apiStore.ts、advancedStore.ts |
| createStore、useStore | AdvancedDemos 中两个独立计数器 |
| createWithEqualityFn、useStoreWithEqualityFn | advancedStore.ts、AdvancedDemos |
| shallow、useShallow | AdvancedDemos、CatController、API 多字段选择器 |
| persist、createJSONStorage | apiStore.ts |
| devtools、immer、combine、subscribeWithSelector | apiStore.ts |
| redux | advancedStore.ts |

覆盖官方列出的全部公共函数、hooks 和中间件；并非穷举每个配置参数。persist 卡片演示 rehydrate、hasHydrated、getOptions、clearStorage 和 hydration 监听清理。传统相等比较入口依赖 use-sync-external-store。

## 升级要点

- create 的 hook 不再接受第二个 equalityFn 参数；对象/元组选择器使用 useShallow。
- get/getState 只取快照；React 更新依赖 hook 的订阅。
- replace: true 必须提供完整状态，包括 action。getInitialState 可用于重置。
- subscribe 返回取消函数，组件 effect 卸载时调用。v5 没有 destroy。
- Todo 派生数据在订阅原始 todos/filter 后通过 useMemo 计算，避免新对象快照导致循环渲染。
- clearStorage 只清持久化记录，不重置内存。

运行：npm run dev。检查：npm test、npm run lint、npm run build。

参考：https://zustand.docs.pmnd.rs/reference/index

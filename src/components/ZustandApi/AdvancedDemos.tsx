import { useEffect, useState } from 'react'
import { useStore } from 'zustand'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/vanilla/shallow'
import { createCounterStore, useEqualityStore, useReducerStore } from '../../stores/advancedStore'
import { usePersistStore } from '../../stores/apiStore'

function CounterInstance() {
  const [store] = useState(createCounterStore)
  const count = useStore(store, (state) => state.count)
  const selection = useStoreWithEqualityFn(store, (state) => ({ label: state.label }), shallow)
  const [events, setEvents] = useState(0)
  useEffect(() => store.subscribe(() => setEvents((value) => value + 1)), [store])
  return <div className="demo-box">
    <p>{selection.label}：{count}；订阅通知：{events}</p>
    <button onClick={() => store.setState((state) => ({ count: state.count + 1 }))}>独立计数 +1</button>
    <button onClick={() => store.setState(store.getInitialState(), true)}>重置实例</button>
  </div>
}

export function AdvancedDemos() {
  const selected = useEqualityStore((state) => ({ count: state.count }))
  const count = useReducerStore((state) => state.count)
  const dispatch = useReducerStore((state) => state.dispatch)
  const [hydrated, setHydrated] = useState(usePersistStore.persist.hasHydrated())
  const [message, setMessage] = useState('')
  useEffect(() => {
    const start = usePersistStore.persist.onHydrate(() => setHydrated(false))
    const end = usePersistStore.persist.onFinishHydration(() => setHydrated(true))
    return () => { start(); end() }
  }, [])
  return <section className="api-demo-group">
    <div className="api-demo-group__heading"><p>Zustand v5</p><h2>独立 Store、相等比较与生命周期</h2></div>
    <div className="api-cards-grid">
      <article className="api-section">
        <h3>createStore / useStore / useStoreWithEqualityFn</h3>
        <p>两个实例互不影响。subscribe 返回清理函数；getInitialState 用于完整重置。</p>
        <CounterInstance /><CounterInstance />
      </article>
      <article className="api-section">
        <h3>createWithEqualityFn / shallow</h3>
        <p>对象选择器按 shallow 比较。traditional 入口需要 use-sync-external-store。</p>
        <p>选中的计数：{selected.count}；shallow 比较同值对象：{String(shallow({ a: 1 }, { a: 1 }))}</p>
        <button onClick={() => useEqualityStore.setState((state) => ({ count: state.count + 1 }))}>相等比较计数 +1</button>
      </article>
      <article className="api-section">
        <h3>redux：reducer 与 dispatch</h3><p>计数：{count}</p>
        <button onClick={() => dispatch({ type: 'increment', by: 2 })}>dispatch +2</button>
        <button onClick={() => dispatch({ type: 'reset' })}>dispatch reset</button>
      </article>
      <article className="api-section">
        <h3>persist：恢复与存储控制</h3>
        <p>恢复完成：{String(hydrated)}；存储键：{usePersistStore.persist.getOptions().name}</p>
        <p>clearStorage 仅删除存储，不改变当前内存状态。下一次更新会重新保存。</p>
        <button onClick={() => { void usePersistStore.persist.rehydrate() }}>重新恢复</button>
        <button onClick={() => { void usePersistStore.persist.clearStorage(); setMessage('已删除持久化记录，内存状态保留') }}>清除存储</button>
        <p role="status">{message}</p>
      </article>
    </div>
  </section>
}

import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { lessons } from '../components/ZustandApi/lessons'
import storeSource from '../stores/apiStore.ts?raw'
import advancedSource from '../stores/advancedStore.ts?raw'
import './Api.css'

export const Api = () => {
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'recipe' | 'source'>('recipe')
  const [copyStatus, setCopyStatus] = useState('')
  const lesson = lessons.find(item => item.id === params.get('lesson')) ?? lessons[0]
  const index = lessons.indexOf(lesson)
  const visible = lessons.filter(item => (item.title + item.api + item.purpose).toLowerCase().includes(search.toLowerCase()))
  const code = view === 'recipe' ? lesson.code : lesson.id === 'instances' ? advancedSource : storeSource
  const choose = (id: string) => {
    setParams({ lesson: id })
    setView('recipe')
    setCopyStatus('')
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopyStatus('已复制')
    } catch {
      setCopyStatus('复制失败，请手动选择代码')
    }
  }

  return <main className="api-workbench">
    <header className="lab-header">
      <div><p className="lab-kicker">STATE MANAGEMENT / FIELD GUIDE</p><h1>Zustand <span>用法实验室</span></h1></div>
      <p className="lab-intro">从一个具体问题开始。<br />读代码，动手操作，理解状态如何流动。</p>
      <span className="lab-version">v5 / {lessons.length} 个主题</span>
    </header>
    <div className="lab-layout">
      <aside className="lab-sidebar">
        <label htmlFor="api-search">查找用法</label>
        <input id="api-search" type="search" placeholder="搜索 API 或场景…" value={search} onChange={event => setSearch(event.target.value)} />
        <nav aria-label="API 用法目录">
          {visible.map((item, i) => <div key={item.id}>
            {(i === 0 || visible[i - 1].group !== item.group) && <p className="lab-group">{item.group}</p>}
            <button aria-current={item.id === lesson.id ? 'page' : undefined} onClick={() => choose(item.id)}>
              <span>{item.title}</span><small>{item.api}</small>
            </button>
          </div>)}
          {visible.length === 0 && <p className="lab-empty">没有找到相关用法。试试 persist 或订阅。</p>}
        </nav>
        <a className="lab-docs" href="https://zustand.docs.pmnd.rs/reference/index" target="_blank" rel="noreferrer">官方 API Reference ↗</a>
      </aside>
      <section className="lab-content" aria-label="当前用例">
        <div className="lesson-heading">
          <p className="lab-kicker">{lesson.group} <span>LESSON {String(index + 1).padStart(2, '0')}</span></p>
          <h2>{lesson.title}</h2>
          <p>{lesson.purpose}</p>
          <div className="lesson-api">{lesson.api}</div>
        </div>
        <div className="lab-experiment">
          <section className="lab-live" aria-label="交互演示">
            <div className="lab-panel-title"><h3><i />动手试试</h3><span>LIVE PREVIEW</span></div>
            <ol className="lab-steps">{lesson.steps.map(step => <li key={step}>{step}</li>)}</ol>
            <div className="lab-demos" key={lesson.id}>{lesson.demos.map((Demo, i) => <Demo key={i} />)}</div>
          </section>
          <section className="lab-code" aria-label="代码示例">
            <div className="lab-code-toolbar">
              <div role="group" aria-label="代码视图">
                <button aria-pressed={view === 'recipe'} onClick={() => { setView('recipe'); setCopyStatus('') }}>核心写法</button>
                <button aria-pressed={view === 'source'} onClick={() => { setView('source'); setCopyStatus('') }}>Store 源码</button>
              </div>
              <button onClick={() => { void copy() }}>复制代码</button>
            </div>
            <p className="lab-code-caption">{view === 'recipe' ? 'TSX / 教学片段，省略部分类型与导入' : lesson.id === 'instances' ? 'src/stores/advancedStore.ts' : 'src/stores/apiStore.ts'}</p>
            <pre tabIndex={0}><code>{code}</code></pre>
            <p className="lab-copy-status" role="status">{copyStatus}</p>
          </section>
        </div>
        <aside className="lab-takeaway"><span>记住这一点</span><p>{lesson.takeaway}</p></aside>
        <footer className="lab-footer">
          <span>{String(index + 1).padStart(2, '0')} / {String(lessons.length).padStart(2, '0')} · 切换主题保留共享 store 状态，独立实例在重新挂载时重建</span>
          <button onClick={() => choose(lessons[(index + 1) % lessons.length].id)}>{index === lessons.length - 1 ? '回到第一个主题' : '下一个主题'} →</button>
        </footer>
      </section>
    </div>
  </main>
}

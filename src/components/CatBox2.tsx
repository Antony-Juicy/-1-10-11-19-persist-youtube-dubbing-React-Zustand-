import { useCatStore } from '../stores/catStore'

export const CatBox2 = () => {
  /* 不使用 结构方式 避免重复渲染 可用Math.random()检测是否会重复渲染 */
  const bigCats = useCatStore((state) => state.cats.bigCats)

  return (
    <div className="box">
      <h1>Partial States from catStore</h1>
      <p>big cats: {bigCats}</p>
      <p>{Math.random()}</p>
    </div>
  )
}

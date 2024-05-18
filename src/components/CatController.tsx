import { shallow } from 'zustand/shallow'
import { useCatStore } from '../stores/catStore'

/* 选择多个状态及什么是shallow  可以避免重复渲染 */
export const CatController = () => {
  //   const { increaseBigCats, increaseSmallCats } = useCatStore();
  //   const increaseBigCats = useCatStore.use.increaseBigCats();
  //   const increaseSmallCats = useCatStore.use.increaseSmallCats();

  // const { increaseBigCats, increaseSmallCats } = useCatStore(
  //   (state) => ({
  //     increaseBigCats: state.increaseBigCats,
  //     increaseSmallCats: state.increaseSmallCats,
  //   }),
  //   shallow /* 之比较第一次的值 ，避免重复渲染*/
  // )

  const [increaseBigCats, increaseSmallCats] = useCatStore(
    (state) => [state.increaseBigCats, state.increaseSmallCats],
    shallow /* 之比较第一次的值 ，避免重复渲染*/
  )

  return (
    <div className="box">
      <h1>Cat Controller</h1>
      <p>{Math.random()}</p>
      <div>
        <button onClick={increaseBigCats}>add big cats</button>
        <button onClick={increaseSmallCats}>add small cats</button>
      </div>
    </div>
  )
}

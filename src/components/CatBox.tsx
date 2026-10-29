/*
 * @Author: Antony-Juicy wangshengping1064@dingtalk.com
 * @Date: 2023-11-25 18:15:29
 * @LastEditors: Antony-Juicy wangshengping1064@dingtalk.com
 * @LastEditTime: 2024-06-01 15:13:31
 * @FilePath: /react_zustand_tutorial/src/components/CatBox.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useCatStore } from '../stores/catStore';

export const CatBox = () => {
  const cats = useCatStore.use.cats() as { bigCats: number; smallCats: number };
  const increaseBigCats = useCatStore.use.increaseBigCats() as () => void;
  const increaseSmallCats = useCatStore.use.increaseSmallCats() as () => void;
  const summary = useCatStore.use.summary() as () => string;

  // console.log(summary())

  return (
    <div className='box'>
      {`------ ${JSON.stringify(summary())} ------`}

      <h1>Cat Box</h1>
      <p>big cats: {cats.bigCats}</p>
      <p>small cats: {cats.smallCats}</p>
      <p>{Math.random()}</p>
      <div>
        <button onClick={increaseBigCats}>add big cats</button>
        <button onClick={increaseSmallCats}>add small cats</button>
      </div>
    </div>
  );
};

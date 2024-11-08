/*
 * @Author: Antony-Juicy wangshengping1064@dingtalk.com
 * @Date: 2023-11-25 18:15:29
 * @LastEditors: Antony-Juicy wangshengping1064@dingtalk.com
 * @LastEditTime: 2024-11-09 00:21:15
 * @FilePath: /react_zustand_tutorial/src/App.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { CatBox } from './components/CatBox';
import { CatBox2 } from './components/CatBox2';
import { CatController } from './components/CatController';
import Typewriters from './components/Typewriter/TypingEffect';

function App() {
  return (
    <div className='container'>
      <h1>Zustand Tutorial</h1>
      <div>
        <CatBox />
        <CatBox2 />
        <CatController />
      </div>
      <Typewriters />
    </div>
  );
}

export default App;

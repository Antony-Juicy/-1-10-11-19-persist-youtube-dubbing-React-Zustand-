/*
 * @Author: Antony-Juicy wangshengping1064@dingtalk.com
 * @Date: 2023-11-25 18:15:29
 * @LastEditors: Antony-Juicy wangshengping1064@dingtalk.com
 * @LastEditTime: 2024-05-18 19:41:41
 * @FilePath: /react_zustand_tutorial/src/components/FoodBox.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import { useFoodStore, addOneFish, removeOneFish, removeAllFish } from '../stores/foodStore';

export const FoodBox = () => {
  // const { fish, addOneFish, removeOneFish, removeAllFish } = useFoodStore();

  const fish = useFoodStore((state) => state.fish);
  // const fish = useFoodStore.getState().fish; // non-reactive

  const add5Fish = () => {
    useFoodStore.setState((state) => ({
      fish: state.fish + 5,
    }));
  };
  return (
    <div className='box'>
      <h1>Food Box</h1>
      <p>fish: {fish}</p>
      <div>
        <button onClick={addOneFish}>add one fish</button>
        <button onClick={removeOneFish}>remove one fish</button>
        <button onClick={removeAllFish}>remove all fish</button>
        <button onClick={add5Fish}>add 5 fish</button>
      </div>
    </div>
  );
};
